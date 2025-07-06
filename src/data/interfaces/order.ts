// Order Service Interface Definitions

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
  ticketId: string;
  productName: string;
  productDescription?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  ticketType?: string;
  startStationId?: string;
  endStationId?: string;
  validityDuration?: number;
  generatedTickets: TicketReferenceDto[];
  timedTicketPlan: string;
  p2pJourney: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  customerId: string;
  customerInfo: CustomerInfoDto;
  orderType: OrderType;
  status: OrderStatus;
  baseTotal: number;
  discountTotal: number;
  taxAmount: number;
  finalTotal: number;
  discountPackage: string;
  currency: string;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  orderDetails: OrderDetailDto[];
  appliedVouchers: AppliedVoucherDto[];
  voucher?: string;
  orderDate: string;
  paymentDate?: string;
  completionDate?: string;
  notes?: string;
  createdAt: string;
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
