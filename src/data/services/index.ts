// Import service classes
import { BaseService } from "./base.service";
import { AccountService } from "./account.service";
import { TicketService } from "./ticket.service";
import { VoucherService } from "./voucher.service";

// Export service classes
export { BaseService, AccountService, TicketService, VoucherService };

// Create service instances
export const accountService = new AccountService();
export const ticketService = new TicketService();
export const voucherService = new VoucherService();

// Service factory for dependency injection
export const services = {
  account: accountService,
  ticket: ticketService,
  voucher: voucherService,
} as const;

export type ServiceKeys = keyof typeof services;
