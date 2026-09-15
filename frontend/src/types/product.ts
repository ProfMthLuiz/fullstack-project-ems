export interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade_estoque: number;
  status: number;
  marca: string;
  modelo: string;
  garantia_meses: number;
  destaque: number;
  categoria_id: number;
  categoria: string;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginatedResponse {
  data: Product[];
  pagination: Pagination;
}
