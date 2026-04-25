export type User = { id: string; email: string; role: 'ADMIN' | 'CUSTOMER' };

export type ProductImage = { id: string; url: string };

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  hatStyle: string;
  colors: string[];
  sizes: string[];
  category: string;
  stockQty: number;
  modelPath?: string | null;
  active: boolean;
  customizable: boolean;
  type: 'BLANK' | 'READY_MADE';
  images: ProductImage[];
};

export type SavedDesign = {
  id: string;
  productId: string;
  name: string;
  customText?: string;
  decorationType: 'embroidery' | 'patch' | 'print';
  placement: 'front center' | 'left side' | 'right side' | 'brim top' | 'brim underside' | 'back';
  imageUrl?: string;
  transform: { x: number; y: number; scale: number; rotation: number };
  previewShot?: string;
};
