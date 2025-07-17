import { BaseService } from "./base.service";
import {
  OrderDto,
  OrderSummaryDto,
  OrderCreateRequest,
  OrderUpdateRequest,
  OrderQueryParam,
  OrderFilter,
  OrderAnalyticsParam,
  OrderAnalyticsDto,
  PaymentConfirmationRequest,
  RefundRequest,
  PaymentSummaryDto,
  PageDto,
  PageableDto,
  SortDirection,
  OrderDashboard,
  CheckoutRequest,
} from "../interfaces";

export class OrderService extends BaseService {
  private readonly orderPath = "/orders";

  constructor() {
    super();
  }

  // Order Management APIs

  /**
   * Get paginated list of orders
   */
  async getOrders(
    pageable?: PageableDto,
    filters?: OrderFilter
  ): Promise<PageDto<OrderSummaryDto>> {
    return this.getPage<OrderSummaryDto>(
      `${this.orderPath}`,
      pageable || ({ page: 0, size: 10 } as PageableDto),
      {
        status: filters?.status || "",
        customerId: filters?.customerId || "",
        orderType: filters?.orderType || "",
        paymentMethod: filters?.paymentMethod || "",
        paymentStatus: filters?.paymentStatus || "",
        orderDateFrom: filters?.orderDateFrom || "",
        orderDateTo: filters?.orderDateTo || "",
        minAmount: filters?.minAmount || null,
        maxAmount: filters?.maxAmount || null,
        search: filters?.search || "",
        orderNumber: filters?.orderNumber || "",
      } as OrderQueryParam
    );
  }

  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<OrderDto> {
    return this.get<OrderDto>(`${this.orderPath}/${orderNumber}`);
  }

  /**
   * Create new order
   */
  async createOrder(order: OrderCreateRequest): Promise<OrderDto> {
    return this.post<OrderDto>(`${this.orderPath}`, order);
  }

  /**
   * Update order
   */
  async updateOrder(
    orderNumber: string,
    update: OrderUpdateRequest
  ): Promise<OrderDto> {
    return this.put<OrderDto>(`${this.orderPath}/${orderNumber}`, update);
  }

  // Payment Management APIs

  /**
   * Confirm payment for an order
   */
  async confirmPayment(
    orderNumber: string,
    payment: PaymentConfirmationRequest
  ): Promise<OrderDto> {
    return this.post<OrderDto>(
      `${this.orderPath}/${orderNumber}/confirm-payment`,
      payment
    );
  }

  /**
   * Process order refund
   */
  async processRefund(
    orderNumber: string,
    refund: RefundRequest
  ): Promise<OrderDto> {
    return this.post<OrderDto>(
      `${this.orderPath}/${orderNumber}/refund`,
      refund
    );
  }

  // Analytics APIs

  /**
   * Get order analytics
   */
  async getAnalytics(params: OrderAnalyticsParam): Promise<{
    analytics: OrderAnalyticsDto[];
    summary: PaymentSummaryDto;
  }> {
    return this.post<{
      analytics: OrderAnalyticsDto[];
      summary: PaymentSummaryDto;
    }>(`${this.orderPath}/analytics`, params);
  }

  // Utility methods for the CMS

  /**
   * Search orders by order number or customer name
   */
  async searchOrders(
    query: string,
    pageable?: PageableDto
  ): Promise<PageDto<OrderSummaryDto>> {
    const filters: OrderFilter = {
      search: query,
    };

    return this.getOrders(pageable, filters);
  }

  /**
   * Get orders by customer
   */
  async getOrdersByCustomer(
    customerId: string,
    pageable?: PageableDto
  ): Promise<PageDto<OrderSummaryDto>> {
    const filters: OrderFilter = {
      customerId: customerId,
    };

    return this.getOrders(pageable, filters);
  }

  /**
   * Get orders by status
   */
  async getOrdersByStatus(
    status: string,
    pageable?: PageableDto
  ): Promise<PageDto<OrderSummaryDto>> {
    const filters: OrderFilter = {
      status: status as any,
    };

    return this.getOrders(pageable, filters);
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(limit: number = 10): Promise<PageDto<OrderSummaryDto>> {
    return this.getOrders({
      page: 0,
      size: limit,
      sort: { orderDate: SortDirection.DESC },
    });
  }

  /**
   * Get order dashboard metrics
   */
  async getOrderDashboard(): Promise<OrderDashboard> {
    return this.get<OrderDashboard>(`${this.orderPath}/dashboard`);
  }

  /**
   * Checkout - Create order and process payment (Staff offline tool)
   */
  async checkout(checkoutRequest: CheckoutRequest): Promise<OrderDto> {
    return this.post<OrderDto>(`${this.orderPath}/checkout`, checkoutRequest);
  }
}

// Export singleton instance
export const orderService = new OrderService();
