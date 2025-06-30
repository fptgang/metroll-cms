import { BaseEntity } from "./common";
import { AccountRole } from "../types/enums";

// Account DTO - mirrors AccountDto.java
export interface AccountDto extends BaseEntity {
  email: string;
  fullName: string;
  phoneNumber: string;
  role: AccountRole;
  active: boolean;
  assignedStation?: string;
}

// Account Create Request - mirrors account service create request
export interface AccountCreateRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  role: AccountRole;
  password: string;
}

// Account Update Request - mirrors account service update request
export interface AccountUpdateRequest {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  role?: AccountRole;
  active?: boolean;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AccountDto;
  token?: string;
}

// Account Summary for Dashboard
export interface AccountSummary {
  totalAccounts: number;
  totalAdmins: number;
  totalStaff: number;
  totalCustomers: number;
  activeAccounts: number;
  inactiveAccounts: number;
}

// Account Filter Options
export interface AccountFilter {
  search?: string;
  role?: AccountRole;
  active?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}

export interface StationAssignmentRequest {
  stationCode: string;
}
