import { BaseEntity } from "./common";

// Discount Package DTO - mirrors DiscountPackageDto.java
export interface DiscountPackageDto extends BaseEntity {
  name: string;
  description: string;
  discountPercentage: number; // 0.0-1.0 (0% to 100%)
  duration: number; // days
  status: "ACTIVE" | "TERMINATED";
}

// Account Discount Package DTO - mirrors AccountDiscountPackageDto.java
export interface AccountDiscountPackageDto extends BaseEntity {
  accountId: string;
  discountPackageId: string;
  activateDate: string;
  validUntil: string;
  status: "ACTIVATED" | "EXPIRED" | "CANCELLED";
}

// Discount Package Create Request
export interface DiscountPackageCreateRequest {
  name: string;
  description: string;
  discountPercentage: number; // 0.0-1.0
  duration: number; // 1-365 days
}

// Discount Package Update Request
export interface DiscountPackageUpdateRequest {
  name: string;
  description: string;
  discountPercentage: number; // 0.0-1.0
  duration: number; // 1-365 days
}

// Account Discount Assign Request
export interface AccountDiscountAssignRequest {
  accountId: string;
  discountPackageId: string;
}

// Discount Package Filter Options
export interface DiscountPackageFilter {
  search?: string;
  status?: "ACTIVE" | "TERMINATED";
  createdAfter?: string;
  createdBefore?: string;
}

// Account Discount Package Filter Options
export interface AccountDiscountPackageFilter {
  accountId?: string;
  packageId?: string;
  status?: "ACTIVATED" | "EXPIRED" | "CANCELLED";
  createdAfter?: string;
  createdBefore?: string;
}
