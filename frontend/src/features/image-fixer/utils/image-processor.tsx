import {
  ImageFixOptions,
  OutputImageFormat,
  ProcessedImageResult,
} from '../types/image-fixer.types';

function getMimeType(format: OutputImageFormat) {
  return `image/${format}`;
}

function getFileExtension(format: OutputImageFormat) {
  if (format === 'jpeg') {
    return 'jpg';
  }

  return format;
}

function getFileSizeKB(file: Blob) {
  return Math.round(file.size / 1024);
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
) {
  const sourceRatio = image.width / image.height;
  const targetRatio = targetWidth / targetHeight;

  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;

  if (sourceRatio > targetRatio) {
    sourceWidth = image.height * targetRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / targetRatio;
    sourceY = (image.height - sourceHeight) / 2;
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

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, options.width, options.height);

  drawImageCover(context, image, options.width, options.height);

  const mimeType = getMimeType(options.outputFormat);

  let quality = 0.92;
  let blob = await canvasToBlob(canvas, mimeType, quality);

  while (getFileSizeKB(blob) > options.maxSizeKB && quality > 0.1) {
    quality -= 0.07;
    blob = await canvasToBlob(canvas, mimeType, quality);
  }

  const extension = getFileExtension(options.outputFormat);

  const processedFile = new File([blob], `formfit-result.${extension}`, {
    type: mimeType,
  });

  return {
    file: processedFile,
    previewUrl: URL.createObjectURL(processedFile),
    sizeKB: getFileSizeKB(processedFile),
    width: options.width,
    height: options.height,
    format: options.outputFormat,
  };
}