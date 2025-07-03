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

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  existingProduct?: Product;
  onSave: (updatedProduct: Product) => Promise<void>;
}

export interface FormDataState {
  name: string;
  shortDescription: string;
  longDescription: string;
  categoryId: string;
  price: string;
}

export interface Category {
  id: number;
  code: string;
  description: string;
}

export interface CategoriesResponse {
  data: Category[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export interface DeleteModalProps {
  isOpen: boolean;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
  saving?: boolean;
}
