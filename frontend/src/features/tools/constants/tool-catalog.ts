export type ToolAccess = 'guest' | 'free' | 'pro';

export type ToolCatalogItem = {
  href: string;
  name: string;
  description: string;
  access: ToolAccess;
};

export const TOOL_CATALOG: ToolCatalogItem[] = [
  {
    href: '/tools/image-fixer',
    name: 'Image Form Fixer',
    description: 'Resize, compress, crop, and convert form images.',
    access: 'guest',
  },
  {
    href: '/tools/signature-resizer',
    name: 'Signature Resizer',
    description: 'Fit scanned signatures into strict upload boxes.',
    access: 'free',
  },
  {
    href: '/tools/image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert application images into one PDF.',
    access: 'free',
  },
  {
    href: '/tools/pdf-compressor',
    name: 'PDF Optimizer',
    description: 'Re-save PDFs with browser-side optimization.',
    access: 'pro',
  },
  {
    href: '/tools/merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one file.',
    access: 'pro',
  },
  {
    href: '/tools/split-pdf',
    name: 'Split PDF',
    description: 'Extract selected pages from a PDF.',
    access: 'pro',
  },
];

export function getToolAccessLabel(access: ToolAccess) {
  if (access === 'guest') {
    return 'Guest';
  }

  if (access === 'free') {
    return 'Free account';
  }

  return 'Pro';
}
