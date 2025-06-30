import { BaseService } from "./base.service";
import {
  VoucherDto,
  VoucherCreateRequest,
  VoucherUpdateRequest,
  VoucherFilter,
  VoucherSummary,
  PageDto,
  PageableDto,
  VoucherStatus,
} from "../interfaces";

export class VoucherService extends BaseService {
  private readonly endpoint = "/vouchers";

  constructor() {
    super();
  }

  // CRUD Operations
  async getVouchers(
    pageable?: PageableDto,
    filters?: VoucherFilter
  ): Promise<PageDto<VoucherDto>> {
    try {
      return await this.getPage<VoucherDto>(this.endpoint, pageable, filters);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVoucherById(id: string): Promise<VoucherDto> {
    try {
      return await this.get<VoucherDto>(`${this.endpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVoucherByCode(code: string): Promise<VoucherDto> {
    try {
      return await this.get<VoucherDto>(`${this.endpoint}/code/${code}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVouchersByOwnerId(ownerId: string): Promise<VoucherDto[]> {
    try {
      return await this.get<VoucherDto[]>(`${this.endpoint}/owner/${ownerId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVouchersByStatus(status: VoucherStatus): Promise<VoucherDto[]> {
    try {
      return await this.get<VoucherDto[]>(`${this.endpoint}/status/${status}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createVoucher(voucher: VoucherCreateRequest): Promise<VoucherDto> {
    try {
      return await this.post<VoucherDto>(this.endpoint, voucher);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateVoucher(
    id: string,
    voucher: VoucherUpdateRequest
  ): Promise<VoucherDto> {
    try {
      return await this.put<VoucherDto>(`${this.endpoint}/${id}`, voucher);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteVoucher(id: string): Promise<void> {
    try {
      await this.delete<void>(`${this.endpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Status Management
  async updateVoucherStatus(
    id: string,
    status: VoucherStatus
  ): Promise<VoucherDto> {
    try {
      return await this.put<VoucherDto>(`${this.endpoint}/${id}/status`, {
        status,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async activateVoucher(id: string): Promise<VoucherDto> {
    return this.updateVoucherStatus(id, VoucherStatus.VALID);
  }

  async deactivateVoucher(id: string): Promise<VoucherDto> {
    return this.updateVoucherStatus(id, VoucherStatus.REVOKED);
  }

  async useVoucher(id: string): Promise<VoucherDto> {
    return this.updateVoucherStatus(id, VoucherStatus.USED);
  }

  // Dashboard and Analytics
  async getVoucherSummary(): Promise<VoucherSummary> {
    try {
      // This endpoint might need to be implemented on the backend
      return await this.get<VoucherSummary>(`${this.endpoint}/summary`);
    } catch (error) {
      // Fallback: calculate from paginated data
      const vouchers = await this.getVouchers({ page: 0, size: 1000 });
      return this.calculateSummaryFromVouchers(vouchers.content);
    }
  }

  // Helper method to calculate summary from voucher data
  private calculateSummaryFromVouchers(vouchers: VoucherDto[]): VoucherSummary {
    const summary = {
      totalVouchers: vouchers.length,
      preservedVouchers: 0,
      validVouchers: 0,
      usedVouchers: 0,
      expiredVouchers: 0,
      revokedVouchers: 0,
      totalDiscountAmount: 0,
    };

    vouchers.forEach((voucher) => {
      // Count by status
      switch (voucher.status) {
        case VoucherStatus.PRESERVED:
          summary.preservedVouchers++;
          break;
        case VoucherStatus.VALID:
          summary.validVouchers++;
          break;
        case VoucherStatus.USED:
          summary.usedVouchers++;
          break;
        case VoucherStatus.EXPIRED:
          summary.expiredVouchers++;
          break;
        case VoucherStatus.REVOKED:
          summary.revokedVouchers++;
          break;
      }

      // Sum discount amounts
      summary.totalDiscountAmount += voucher.discountAmount;
    });

    return summary;
  }

  // Search vouchers
  async searchVouchers(
    query: string,
    pageable?: PageableDto
  ): Promise<PageDto<VoucherDto>> {
    try {
      return await this.getVouchers(pageable, { search: query });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Validation
  async validateVoucherCode(
    code: string,
    transactionAmount: number
  ): Promise<boolean> {
    try {
      const voucher = await this.getVoucherByCode(code);
      const now = new Date();
      const validFrom = new Date(voucher.validFrom);
      const validUntil = new Date(voucher.validUntil);

      return (
        voucher.status === VoucherStatus.VALID &&
        now >= validFrom &&
        now <= validUntil &&
        transactionAmount >= voucher.minTransactionAmount
      );
    } catch (error) {
      return false; // Voucher not found or invalid
    }
  }

  // Bulk operations
  async bulkUpdateStatus(ids: string[], status: VoucherStatus): Promise<void> {
    try {
      await Promise.all(ids.map((id) => this.updateVoucherStatus(id, status)));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await Promise.all(ids.map((id) => this.deleteVoucher(id)));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generate voucher codes
  async generateVoucherCode(): Promise<string> {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `METRO${timestamp}${random}`;
  }
}
