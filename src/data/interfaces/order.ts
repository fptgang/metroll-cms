// Order Service Interface Definitions

import { TicketType } from "../types/enums";
import { AccountDto } from "./account";

// Order Enums and Types
export enum OrderStatus {
  PENDING = "PENDING",
  // PAID = "PAID",
  // PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  // CANCELLED = "CANCELLED",
  // REFUNDED = "REFUNDED",
  FAILED = "FAILED",
}

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  DIGITAL_WALLET = "DIGITAL_WALLET",
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH = "CASH",
  PAYOS = "PAYOS",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  AUTHORIZED = "AUTHORIZED",
  CAPTURED = "CAPTURED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum OrderType {
  SINGLE_TICKET = "SINGLE_TICKET",
  BULK_TICKETS = "BULK_TICKETS",
  SUBSCRIPTION = "SUBSCRIPTION",
  TIMED_PASS = "TIMED_PASS",
}

export enum RefundStatus {
  NOT_REQUESTED = "NOT_REQUESTED",
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PROCESSED = "PROCESSED",
}

// Order Interfaces
export interface CustomerInfoDto {
  customerId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface AppliedVoucherDto {
  voucherId: string;
  voucherCode: string;
  discountAmount: number;
  appliedAt: string;
}

export interface TicketReferenceDto {
  ticketId: string;
  ticketNumber: string;
  ticketType: string;
  validUntil?: string;
}

export interface OrderDetailDto {
  id: string;
  orderId: string;
  ticketType?: string;
  p2pJourney?: string;
  timedTicketPlan?: string;
  unitPrice: number;
  baseTotal: number;
  discountTotal: number;
  finalTotal: number;
  createdAt: string;
}

export interface OrderDto {
  id: string;

  // Nhân viên giúp mua vé offline
  staffId: string;
  staff: AccountDto; // Reference to Account

  // Khách hàng, có thể null nếu nhân viên ko nhập
  customerId: string | null;
  customer: AccountDto | null; // Reference to Account

  discountPackage: string; // Reference to AccountDiscountPackage._id
  voucher: string; // Reference to Voucher._id

  baseTotal: number; // tổng giá
  discountTotal: number; // tổng discount
  finalTotal: number; // tổng cuối cùng

  paymentMethod: 'CASH' | 'VNPAY' | 'PAYOS';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionReference: string;

  // PayOS payment information
  paymentUrl: string;
  qrCode: string;

  orderDetails: OrderDetailDto[];
  createdAt: string; // ISO 8601 string (Instant in Java)
  updatedAt: string;
}

export interface OrderSummaryDto {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  totalAmount: number;
  orderDate: string;
  paymentMethod?: PaymentMethod;
  itemCount: number;
}

export interface OrderAnalyticsDto {
  period: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topPaymentMethod: PaymentMethod;
  statusBreakdown: Record<OrderStatus, number>;
}

export interface PaymentSummaryDto {
  totalPaid: number;
  totalPending: number;
  totalRefunded: number;
  paymentMethodBreakdown: Record<PaymentMethod, number>;
}

// Request DTOs
export interface OrderDetailCreateRequest {
  productType: string;
  productId: string;
  quantity: number;
  startStationId?: string;
  endStationId?: string;
  validityDuration?: number;
}

export interface OrderCreateRequest {
  customerId?: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  orderDetails: OrderDetailCreateRequest[];
  voucherCodes?: string[];
  customerNotes?: string;
}

export interface OrderUpdateRequest {
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  notes?: string;
}

export interface PaymentConfirmationRequest {
  paymentReference: string;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  paymentDate: string;
  gatewayResponse?: any;
}

export interface RefundRequest {
  orderId: string;
  refundAmount?: number;
  reason: string;
  adminNotes?: string;
}

// Query Parameters
export interface OrderQueryParam {
  customerId?: string;
  status?: OrderStatus;
  orderType?: OrderType;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  orderDateFrom?: string;
  orderDateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  orderNumber?: string;
}

export interface OrderAnalyticsParam {
  dateFrom: string;
  dateTo: string;
  groupBy?: "day" | "week" | "month";
  customerId?: string;
}

// Filter interfaces for API requests
export interface OrderFilter extends OrderQueryParam {
  // Additional filter properties if needed
}

// Checkout interfaces for staff offline tool
export interface CheckoutItemRequest {
  ticketType: TicketType;
  p2pJourneyId?: string; // Required for P2P tickets
  timedTicketPlanId?: string; // Required for TIMED tickets
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItemRequest[];
  paymentMethod: PaymentMethod;
  voucherId?: string;
  customerId?: string;
}
