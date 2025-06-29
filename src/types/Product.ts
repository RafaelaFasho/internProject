export interface Product {
  id: number;
  name: string;
  shortDescription: string;
  longDescription: string;
  categoryId: string;
  price: number;
  imageUpload?: File;
  imagePath?: string;
}
