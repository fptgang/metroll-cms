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
} from "../interfaces";

export class OrderService extends BaseService {
  private readonly orderPath = "/orders/v1";

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
    return this.post<PageDto<OrderSummaryDto>>(
      `${this.orderPath}/list`,
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
      } as OrderQueryParam,
      { params: pageable || { page: 0, size: 10 } }
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
   * Get order statistics for dashboard
   */
  async getDashboardStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  }> {
    // This would be a dedicated endpoint in a real implementation
    // For now, we'll simulate it by getting analytics for the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    try {
      const analytics = await this.getAnalytics({
        dateFrom: startOfMonth.toISOString().split("T")[0],
        dateTo: now.toISOString().split("T")[0],
        groupBy: "month",
      });

      if (analytics.analytics.length > 0) {
        const monthData = analytics.analytics[0];
        return {
          totalOrders: monthData.totalOrders,
          pendingOrders: monthData.statusBreakdown.PENDING || 0,
          completedOrders: monthData.statusBreakdown.COMPLETED || 0,
          totalRevenue: monthData.totalRevenue,
        };
      }
    } catch (error) {
      console.warn("Failed to fetch analytics, returning default stats");
    }

    return {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
    };
  }
}

// Export singleton instance
export const orderService = new OrderService();
