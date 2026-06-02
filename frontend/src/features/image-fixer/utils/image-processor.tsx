import {
  ImageFixOptions,
  OutputImageFormat,
  ProcessedImageResult,
} from '../types/image-fixer.types';

function getMimeType(format: OutputImageFormat) {
  return `image/${format}`;
}

function getFileExtension(format: OutputImageFormat) {
  return format === 'jpeg' ? 'jpg' : format;
}

function getFileSizeKB(file: Blob) {
  return Math.round(file.size / 1024);
}

function sanitizeFilename(filename: string, fallback: string) {
  const sanitized = filename
    .trim()
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  return sanitized || fallback;
}

function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Could not load image file'));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Could not process image'));
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  cropPosition: ImageFixOptions['cropPosition'],
) {
  const sourceRatio = image.width / image.height;
  const targetRatio = targetWidth / targetHeight;

  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  if (sourceRatio > targetRatio) {
    sourceWidth = image.height * targetRatio;

    if (cropPosition === 'left') {
      sourceX = 0;
    } else if (cropPosition === 'right') {
      sourceX = image.width - sourceWidth;
    } else {
      sourceX = (image.width - sourceWidth) / 2;
    }
  } else {
    sourceHeight = image.width / targetRatio;

    if (cropPosition === 'top') {
      sourceY = 0;
    } else if (cropPosition === 'bottom') {
      sourceY = image.height - sourceHeight;
    } else {
      sourceY = (image.height - sourceHeight) / 2;
    }
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );
}

function drawImageContain(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
) {
  const scale = Math.min(targetWidth / image.width, targetHeight / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const drawX = (targetWidth - drawWidth) / 2;
  const drawY = (targetHeight - drawHeight) / 2;

  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

export async function processImageFile(
  file: File,
  options: ImageFixOptions,
): Promise<ProcessedImageResult> {
  const image = await createImageFromFile(file);

  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not supported in this browser');
  }

  if (options.background === 'white' || options.outputFormat === 'jpeg') {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, options.width, options.height);
  } else {
    context.clearRect(0, 0, options.width, options.height);
  }

  if (options.fitMode === 'contain') {
    drawImageContain(context, image, options.width, options.height);
  } else {
    drawImageCover(
      context,
      image,
      options.width,
      options.height,
      options.cropPosition,
    );
  }

  const mimeType = getMimeType(options.outputFormat);

  let quality = 0.92;
  let blob = await canvasToBlob(canvas, mimeType, quality);

  while (getFileSizeKB(blob) > options.maxSizeKB && quality > 0.1) {
    quality -= 0.07;
    blob = await canvasToBlob(canvas, mimeType, quality);
  }

  const extension = getFileExtension(options.outputFormat);
  const targetReached = getFileSizeKB(blob) <= options.maxSizeKB;
  const processedFile = new File(
    [blob],
    `${sanitizeFilename(options.filename, 'formfit-result')}.${extension}`,
    {
      type: mimeType,
    },
  );

  return {
    file: processedFile,
    previewUrl: URL.createObjectURL(processedFile),
    sizeKB: getFileSizeKB(processedFile),
    width: options.width,
    height: options.height,
    format: options.outputFormat,
    targetReached,
  };
}
