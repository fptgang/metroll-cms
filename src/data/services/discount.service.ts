import { BaseService } from "./base.service";
import {
  DiscountPackageDto,
  AccountDiscountPackageDto,
  DiscountPackageCreateRequest,
  DiscountPackageUpdateRequest,
  AccountDiscountAssignRequest,
  DiscountPackageFilter,
  AccountDiscountPackageFilter,
  PageableDto,
  PageDto,
} from "../interfaces";

export class DiscountService extends BaseService {
  // Discount Package Management

  // Get paginated discount packages
  async getDiscountPackages(
    pageable?: PageableDto,
    filters?: DiscountPackageFilter
  ): Promise<PageDto<DiscountPackageDto>> {
    return this.getPage<DiscountPackageDto>(
      "/discount-packages",
      pageable,
      filters
    );
  }

  // Get discount package by ID
  async getDiscountPackageById(id: string): Promise<DiscountPackageDto> {
    return this.get<DiscountPackageDto>(`/discount-packages/${id}`);
  }

  // Create discount package
  async createDiscountPackage(
    data: DiscountPackageCreateRequest
  ): Promise<DiscountPackageDto> {
    return this.post<DiscountPackageDto>("/discount-packages", data);
  }

  // Update discount package
  async updateDiscountPackage(
    id: string,
    data: DiscountPackageUpdateRequest
  ): Promise<DiscountPackageDto> {
    return this.put<DiscountPackageDto>(`/discount-packages/${id}`, data);
  }

  // Terminate discount package
  async terminateDiscountPackage(id: string): Promise<void> {
    return this.delete<void>(`/discount-packages/${id}`);
  }

  // Account Discount Package Management

  // Get paginated account discount packages
  async getAccountDiscountPackages(
    pageable?: PageableDto,
    filters?: AccountDiscountPackageFilter
  ): Promise<PageDto<AccountDiscountPackageDto>> {
    return this.getPage<AccountDiscountPackageDto>(
      "/account-discount-packages",
      pageable,
      filters
    );
  }

  // Get account discount package by ID
  async getAccountDiscountPackageById(
    id: string
  ): Promise<AccountDiscountPackageDto> {
    return this.get<AccountDiscountPackageDto>(
      `/account-discount-packages/${id}`
    );
  }

  // Get account discount package by account ID
  async getAccountDiscountPackageByAccountId(
    accountId: string
  ): Promise<AccountDiscountPackageDto> {
    return this.get<AccountDiscountPackageDto>(
      `/account-discount-packages/account/${accountId}`
    );
  }

  // Assign discount package to account
  async assignDiscountPackage(
    data: AccountDiscountAssignRequest
  ): Promise<AccountDiscountPackageDto> {
    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('accountId', data.accountId);
    formData.append('discountPackageId', data.discountPackageId);
    
    if (data.document) {
      formData.append('document', data.document);
    }

    // Get Firebase auth token
    const { auth } = await import("../../utils/firebase");
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;

    const response = await fetch(`${this.baseUrl}/account-discount-packages/assign`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        // Don't set Content-Type header - browser will set it with boundary for FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return response.json();
  }

  // Unassign discount package from account
  async unassignDiscountPackage(id: string): Promise<void> {
    return this.delete<void>(`/account-discount-packages/${id}`);
  }
}

export const discountService = new DiscountService();
