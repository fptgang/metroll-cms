# Data Layer Documentation

This document provides comprehensive information about the data layer structure and usage in the Metroll CMS.

## Overview

The data layer is organized into three main components:

1. **Interfaces** - TypeScript interfaces that mirror the backend DTOs
2. **Services** - API service classes for handling HTTP requests
3. **Types** - Enums and utility types

## Directory Structure

```
src/data/
├── interfaces/
│   ├── common.ts          # Common interfaces (pagination, errors, etc.)
│   ├── account.ts         # Account-related interfaces
│   ├── ticket.ts          # Ticket-related interfaces
│   ├── voucher.ts         # Voucher-related interfaces
│   └── index.ts           # Barrel export
├── services/
│   ├── base.service.ts    # Base service with common functionality
│   ├── account.service.ts # Account management service
│   ├── ticket.service.ts  # Ticket management service
│   ├── voucher.service.ts # Voucher management service
│   └── index.ts           # Service exports and instances
├── types/
│   └── enums.ts           # All enums used in the system
└── index.ts               # Main export file
```

## Interfaces

### Common Interfaces

#### PageDto<T>

Represents paginated data responses from the backend.

```typescript
interface PageDto<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
```

#### PageableDto

Used for pagination requests.

```typescript
interface PageableDto {
  page: number;
  size: number;
  sort?: Record<string, SortDirection>;
}
```

#### ErrorResponse

Standard error response format.

```typescript
interface ErrorResponse {
  error: string;
}
```

### Account Interfaces

#### AccountDto

Main account data transfer object.

```typescript
interface AccountDto extends BaseEntity {
  email: string;
  fullName: string;
  phoneNumber: string;
  role: AccountRole;
  active: boolean;
}
```

#### AccountCreateRequest

Data required to create a new account.

```typescript
interface AccountCreateRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  role: AccountRole;
  password: string;
}
```

#### AccountUpdateRequest

Data for updating an existing account.

```typescript
interface AccountUpdateRequest {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  role?: AccountRole;
  active?: boolean;
}
```

### Ticket Interfaces

#### TicketDto

Main ticket data transfer object.

```typescript
interface TicketDto extends BaseEntity {
  ticketType: TicketType;
  ticketNumber: string;
  ticketOrderDetailId: string;
  purchaseDate: string;
  validUntil: string;
  status: TicketStatus;
}
```

#### P2PJourneyDto

Point-to-point journey information.

```typescript
interface P2PJourneyDto extends BaseEntity {
  startStationId: string;
  endStationId: string;
  basePrice: number;
  distance: number;
  travelTime: number;
}
```

#### TimedTicketPlanDto

Timed ticket plan information.

```typescript
interface TimedTicketPlanDto extends BaseEntity {
  name: string;
  validDuration: number;
  basePrice: number;
}
```

#### TicketValidationDto

Ticket validation record.

```typescript
interface TicketValidationDto extends BaseEntity {
  stationId: string;
  ticketId: string;
  validationType: ValidationType;
  validationTime: string;
  deviceId: string;
}
```

## Services

### BaseService

The `BaseService` class provides common functionality for all API services:

- **HTTP Methods**: GET, POST, PUT, DELETE
- **Authentication**: Automatic Firebase token handling
- **Error Handling**: Standardized error processing
- **Pagination**: Built-in pagination support

```typescript
// Generic methods available in all services
protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
protected async post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>
protected async put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>
protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
protected async getPage<T>(url: string, pageable?: PageableDto, filters?: Record<string, any>): Promise<PageDto<T>>
```

### AccountService

Handles all account-related operations:

#### Authentication

```typescript
// Login with credentials
async login(credentials: LoginRequest): Promise<LoginResponse>

// Get current user information
async getCurrentUser(): Promise<AccountDto>
```

#### CRUD Operations

```typescript
// Get paginated list of accounts
async getAccounts(pageable?: PageableDto, filters?: AccountFilter): Promise<PageDto<AccountDto>>

// Get account by ID
async getAccountById(id: string): Promise<AccountDto>

// Create new account
async createAccount(account: AccountCreateRequest): Promise<AccountDto>

// Update existing account
async updateAccount(id: string, account: AccountUpdateRequest): Promise<AccountDto>

// Deactivate account
async deactivateAccount(id: string): Promise<void>
```

#### Analytics

```typescript
// Get account summary for dashboard
async getAccountSummary(): Promise<AccountSummary>

// Search accounts
async searchAccounts(query: string, pageable?: PageableDto): Promise<PageDto<AccountDto>>
```

#### Bulk Operations

```typescript
// Update status for multiple accounts
async bulkUpdateStatus(ids: string[], active: boolean): Promise<void>

// Delete multiple accounts
async bulkDelete(ids: string[]): Promise<void>
```

### TicketService

Comprehensive ticket management service:

#### Ticket Operations

```typescript
// Get paginated tickets
async getTickets(pageable?: PageableDto, filters?: TicketFilter): Promise<PageDto<TicketDto>>

// Get ticket by ID
async getTicketById(id: string): Promise<TicketDto>

// Get ticket by number
async getTicketByNumber(ticketNumber: string): Promise<TicketDto>

// Create new ticket
async createTicket(ticket: TicketUpsertRequest): Promise<TicketDto>

// Update ticket status
async updateTicketStatus(id: string, status: TicketStatus): Promise<void>
```

#### Validation Operations

```typescript
// Get ticket validations
async getTicketValidations(pageable?: PageableDto, filters?: Record<string, any>): Promise<PageDto<TicketValidationDto>>

// Validate a ticket (check-in/check-out)
async validateTicket(validation: TicketValidationCreateRequest): Promise<TicketValidationDto>
```

#### Journey Management

```typescript
// Get P2P journeys
async getP2PJourneys(pageable?: PageableDto, filters?: Record<string, any>): Promise<PageDto<P2PJourneyDto>>

// Create P2P journey
async createP2PJourney(journey: P2PJourneyCreateRequest): Promise<P2PJourneyDto>

// Update P2P journey
async updateP2PJourney(id: string, journey: P2PJourneyUpdateRequest): Promise<P2PJourneyDto>
```

#### Ticket Plan Management

```typescript
// Get timed ticket plans
async getTimedTicketPlans(pageable?: PageableDto, filters?: Record<string, any>): Promise<PageDto<TimedTicketPlanDto>>

// Create timed ticket plan
async createTimedTicketPlan(plan: TimedTicketPlanCreateRequest): Promise<TimedTicketPlanDto>

// Update timed ticket plan
async updateTimedTicketPlan(id: string, plan: TimedTicketPlanUpdateRequest): Promise<TimedTicketPlanDto>
```

### VoucherService

Voucher management functionality:

```typescript
// Basic CRUD operations
async getVouchers(pageable?: PageableDto, filters?: VoucherFilter): Promise<PageDto<VoucherDto>>
async createVoucher(voucher: VoucherCreateRequest): Promise<VoucherDto>
async updateVoucher(id: string, voucher: VoucherUpdateRequest): Promise<VoucherDto>

// Status management
async updateVoucherStatus(id: string, status: VoucherStatus): Promise<VoucherDto>
async activateVoucher(id: string): Promise<VoucherDto>
async deactivateVoucher(id: string): Promise<VoucherDto>

// Validation
async validateVoucherCode(code: string, transactionAmount: number): Promise<boolean>

// Code generation
async generateVoucherCode(): Promise<string>
```

## Enums

### AccountRole

```typescript
enum AccountRole {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
}
```

### TicketStatus

```typescript
enum TicketStatus {
  VALID = "VALID",
  USED = "USED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}
```

### TicketType

```typescript
enum TicketType {
  P2P = "P2P",
  TIMED = "TIMED",
}
```

### ValidationType

```typescript
enum ValidationType {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
}
```

### VoucherStatus

```typescript
enum VoucherStatus {
  PRESERVED = "PRESERVED",
  VALID = "VALID",
  USED = "USED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}
```

## Usage Examples

### Using Services in Components

```typescript
import React, { useEffect, useState } from "react";
import { accountService, AccountDto } from "../data";

const AccountComponent: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const result = await accountService.getAccounts(
          { page: 0, size: 10 },
          { search: "admin" }
        );
        setAccounts(result.content);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>{account.fullName}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Using with Refine Hooks

```typescript
import { useList } from "@refinedev/core";
import { AccountDto } from "../data";

const AccountList: React.FC = () => {
  const { data, isLoading } = useList<AccountDto>({
    resource: "account",
    pagination: { pageSize: 10 },
    filters: [{ field: "search", operator: "contains", value: "admin" }],
  });

  // Component implementation
};
```

### Type-Safe Form Handling

```typescript
import { useForm } from "@refinedev/antd";
import { AccountCreateRequest } from "../data";

const AccountCreateForm: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<AccountCreateRequest>();

  return (
    <Form {...formProps}>
      <Form.Item name="fullName" label="Full Name">
        <Input />
      </Form.Item>
      {/* Other form fields */}
    </Form>
  );
};
```

## Best Practices

1. **Type Safety**: Always use the provided interfaces for type safety
2. **Error Handling**: Wrap service calls in try-catch blocks
3. **Loading States**: Implement proper loading states for better UX
4. **Pagination**: Use pagination for large datasets
5. **Filtering**: Implement client-side filtering where appropriate
6. **Caching**: Consider implementing caching for frequently accessed data

## Integration with Backend

The data layer interfaces directly correspond to the backend DTOs:

- `AccountDto` ↔ `com.fpt.metroll.shared.domain.dto.account.AccountDto`
- `TicketDto` ↔ `com.fpt.metroll.shared.domain.dto.ticket.TicketDto`
- `VoucherDto` ↔ `com.fpt.metroll.shared.domain.dto.voucher.VoucherDto`

This ensures consistency between frontend and backend data structures.
