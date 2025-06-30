// Import service classes
import { BaseService } from "./base.service";
import { AccountService } from "./account.service";
import { TicketService } from "./ticket.service";
import { VoucherService } from "./voucher.service";
import { SubwayService } from "./subway.service";
import { OrderService } from "./order.service";

// Export service classes
export {
  BaseService,
  AccountService,
  TicketService,
  VoucherService,
  SubwayService,
  OrderService,
};

// Create service instances
export const accountService = new AccountService();
export const ticketService = new TicketService();
export const voucherService = new VoucherService();
export const subwayService = new SubwayService();
export const orderService = new OrderService();

// Service factory for dependency injection
export const services = {
  account: accountService,
  ticket: ticketService,
  voucher: voucherService,
  subway: subwayService,
  order: orderService,
} as const;

export type ServiceKeys = keyof typeof services;
