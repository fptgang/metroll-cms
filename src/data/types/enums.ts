// Account Related Enums
export enum AccountRole {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER",
}

// Ticket Related Enums
export enum TicketStatus {
  VALID = "VALID",
  USED = "USED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export enum TicketType {
  P2P = "P2P",
  TIMED = "TIMED",
}

export enum ValidationType {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
}

// Voucher Related Enums
export enum VoucherStatus {
  PRESERVED = "PRESERVED",
  VALID = "VALID",
  USED = "USED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

// Utility Types
export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}
