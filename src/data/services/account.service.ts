import { BaseService } from "./base.service";
import {
  AccountDto,
  AccountCreateRequest,
  AccountUpdateRequest,
  AccountFilter,
  AccountSummary,
  LoginRequest,
  LoginResponse,
  PageDto,
  PageableDto,
  StationAssignmentRequest,
  AccountDashboard,
} from "../interfaces";
import { auth } from "../../utils/firebase";

export class AccountService extends BaseService {
  private readonly endpoint = "/accounts";

  constructor() {
    super();
  }

  // Authentication
  async login(): Promise<LoginResponse> {
    try {
      return await this.post<LoginResponse>(`${this.endpoint}/login/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<AccountDto> {
    try {
      return await this.get<AccountDto>(`${this.endpoint}/me/`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // CRUD Operations
  async getAccounts(
    pageable?: PageableDto,
    filters?: AccountFilter
  ): Promise<PageDto<AccountDto>> {
    try {
      return await this.getPage<AccountDto>(
        `${this.endpoint}`,
        pageable,
        filters
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAccountById(id: string): Promise<AccountDto> {
    try {
      return await this.get<AccountDto>(`${this.endpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createAccount(account: AccountCreateRequest): Promise<AccountDto> {
    try {
      return await this.post<AccountDto>(`${this.endpoint}`, account);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateAccount(
    id: string,
    account: AccountUpdateRequest
  ): Promise<AccountDto> {
    try {
      return await this.put<AccountDto>(`${this.endpoint}/${id}`, account);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deactivateAccount(id: string): Promise<void> {
    try {
      await this.delete<void>(`${this.endpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Dashboard and Analytics
  async getAccountSummary(): Promise<AccountSummary> {
    try {
      // This endpoint might need to be implemented on the backend
      return await this.get<AccountSummary>(`${this.endpoint}/summary`);
    } catch (error) {
      // Fallback: calculate from paginated data
      const accounts = await this.getAccounts({ page: 0, size: 1000 });
      return this.calculateSummaryFromAccounts(accounts.content);
    }
  }

  // Helper method to calculate summary from account data
  private calculateSummaryFromAccounts(accounts: AccountDto[]): AccountSummary {
    const summary = {
      totalAccounts: accounts.length,
      totalAdmins: 0,
      totalStaff: 0,
      totalCustomers: 0,
      activeAccounts: 0,
      inactiveAccounts: 0,
    };

    accounts.forEach((account) => {
      // Count by role
      switch (account.role) {
        case "ADMIN":
          summary.totalAdmins++;
          break;
        case "STAFF":
          summary.totalStaff++;
          break;
        case "CUSTOMER":
          summary.totalCustomers++;
          break;
      }

      // Count by status
      if (account.active) {
        summary.activeAccounts++;
      } else {
        summary.inactiveAccounts++;
      }
    });

    return summary;
  }

  // Search accounts
  async searchAccounts(
    query: string,
    pageable?: PageableDto
  ): Promise<PageDto<AccountDto>> {
    try {
      return await this.getAccounts(pageable, { search: query });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Bulk operations
  async bulkUpdateStatus(ids: string[], active: boolean): Promise<void> {
    try {
      await Promise.all(ids.map((id) => this.updateAccount(id, { active })));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await Promise.all(ids.map((id) => this.deactivateAccount(id)));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all staff members
   */
  async getStaffs(
    pageable?: PageableDto,
    filters?: AccountFilter
  ): Promise<PageDto<AccountDto>> {
    try {
      return this.getPage<AccountDto>(
        `${this.endpoint}/staff`,
        pageable,
        filters
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search staffs
  async searchStaffs(
    query: string,
    pageable?: PageableDto
  ): Promise<PageDto<AccountDto>> {
    try {
      return await this.getStaffs(pageable, { search: query });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Assign station to staff member
   */
  async assignStationToStaff(
    staffId: string,
    request: StationAssignmentRequest
  ): Promise<void> {
    return this.put<void>(
      `${this.endpoint}/${staffId}/assign-station`,
      request
    );
  }

  /**
   * Get account dashboard metrics
   */
  async getAccountDashboard(): Promise<AccountDashboard> {
    return this.get<AccountDashboard>(`${this.endpoint}/dashboard`);
  }
}
