import { PDFDocument } from 'pdf-lib';

export type PdfToolResult = {
  file: File;
  sizeKB: number;
  downloadUrl: string;
};

function getFileSizeKB(file: Blob) {
  return Math.round(file.size / 1024);
}

function createPdfFile(bytes: Uint8Array, filename: string) {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;

  return new File([arrayBuffer], filename, {
    type: 'application/pdf',
  });
}

async function readFileAsArrayBuffer(file: File) {
  return file.arrayBuffer();
}

async function imageToJpegBytes(file: File) {
  const image = await createImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not supported in this browser');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (nextBlob) => {
        if (!nextBlob) {
          reject(new Error('Could not convert image'));
          return;
        }

        resolve(nextBlob);
      },
      'image/jpeg',
      0.9,
    );
  });

  return blob.arrayBuffer();
}

function createImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image'));
    };

    image.src = objectUrl;
  });
}

export async function convertImagesToPdf(files: File[]): Promise<PdfToolResult> {
  const pdfDocument = await PDFDocument.create();

  for (const file of files) {
    const jpegBytes = await imageToJpegBytes(file);
    const embeddedImage = await pdfDocument.embedJpg(jpegBytes);
    const page = pdfDocument.addPage([
      embeddedImage.width,
      embeddedImage.height,
    ]);

    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: embeddedImage.width,
      height: embeddedImage.height,
    });
  }

  const pdfBytes = await pdfDocument.save({ useObjectStreams: true });
  const file = createPdfFile(pdfBytes, 'formfit-images.pdf');

  return {
    file,
    sizeKB: getFileSizeKB(file),
    downloadUrl: URL.createObjectURL(file),
  };
}

export async function mergePdfFiles(files: File[]): Promise<PdfToolResult> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const sourcePdf = await PDFDocument.load(await readFileAsArrayBuffer(file));
    const copiedPages = await mergedPdf.copyPages(
      sourcePdf,
      sourcePdf.getPageIndices(),
    );

    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
  const file = createPdfFile(pdfBytes, 'formfit-merged.pdf');

  return {
    file,
    sizeKB: getFileSizeKB(file),
    downloadUrl: URL.createObjectURL(file),
  };
}

export async function optimizePdfFile(file: File): Promise<PdfToolResult> {
  const pdfDocument = await PDFDocument.load(await readFileAsArrayBuffer(file));
  const pdfBytes = await pdfDocument.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
  const optimizedFile = createPdfFile(pdfBytes, 'formfit-optimized.pdf');

  return {
    file: optimizedFile,
    sizeKB: getFileSizeKB(optimizedFile),
    downloadUrl: URL.createObjectURL(optimizedFile),
  };
}

export async function splitPdfFile(
  file: File,
  pageRange: string,
): Promise<PdfToolResult> {
  const sourcePdf = await PDFDocument.load(await readFileAsArrayBuffer(file));
  const selectedPageIndexes = parsePageRange(pageRange, sourcePdf.getPageCount());
  const splitPdf = await PDFDocument.create();
  const copiedPages = await splitPdf.copyPages(sourcePdf, selectedPageIndexes);

  copiedPages.forEach((page) => splitPdf.addPage(page));

  const pdfBytes = await splitPdf.save({ useObjectStreams: true });
  const splitFile = createPdfFile(pdfBytes, 'formfit-split.pdf');

  return {
    file: splitFile,
    sizeKB: getFileSizeKB(splitFile),
    downloadUrl: URL.createObjectURL(splitFile),
  };
}

function parsePageRange(pageRange: string, pageCount: number) {
  const normalizedRange = pageRange.trim();

  if (!normalizedRange) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  const pages = new Set<number>();

  for (const part of normalizedRange.split(',')) {
    const [startText, endText] = part.split('-').map((value) => value.trim());
    const start = Number(startText);
    const end = endText ? Number(endText) : start;

    if (
      Number.isNaN(start) ||
      Number.isNaN(end) ||
      start < 1 ||
      end < start ||
      end > pageCount
    ) {
      throw new Error(`Invalid page range. This PDF has ${pageCount} pages.`);
    }

    for (let page = start; page <= end; page += 1) {
      pages.add(page - 1);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
