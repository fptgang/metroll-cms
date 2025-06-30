import { BaseEntity } from "./common";
import { VoucherStatus } from "../types/enums";

// Voucher DTO - mirrors VoucherDto.java
export interface VoucherDto extends BaseEntity {
  ownerId: string;
  code: string;
  discountAmount: number;
  minTransactionAmount: number;
  validFrom: string;
  validUntil: string;
  status: VoucherStatus;
}

// Voucher Create Request
export interface VoucherCreateRequest {
  ownerIds: string[];
  code: string;
  discountAmount: number;
  minTransactionAmount: number;
  validFrom: string;
  validUntil: string;
}

// Voucher Update Request
export interface VoucherUpdateRequest {
  // ownerId?: string;
  // code?: string;
  discountAmount?: number;
  minTransactionAmount?: number;
  validFrom?: string;
  validUntil?: string;
  // status?: VoucherStatus;
}

// Voucher Summary for Dashboard
export interface VoucherSummary {
  totalVouchers: number;
  preservedVouchers: number;
  validVouchers: number;
  usedVouchers: number;
  expiredVouchers: number;
  revokedVouchers: number;
  totalDiscountAmount: number;
}

// Voucher Filter Options
export interface VoucherFilter {
  search?: string;
  ownerId?: string;
  status?: VoucherStatus;
  validAfter?: string;
  validBefore?: string;
  discountAmountMin?: number;
  discountAmountMax?: number;
}
