import { SortDirection } from "../types/enums";

// Base Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ErrorResponse {
  error: string;
}

// Pagination Types
export interface PageableDto {
  page: number;
  size: number;
  sort?: Record<string, SortDirection>;
}

export interface PageDto<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Base Entity Interface
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// Filter and Search Types
export interface SearchFilter {
  search?: string;
  [key: string]: any;
}

export interface SortConfig {
  field: string;
  order: "asc" | "desc";
}
