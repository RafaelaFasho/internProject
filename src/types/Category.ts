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
