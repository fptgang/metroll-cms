import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  OrderDto,
  OrderSummaryDto,
  OrderCreateRequest,
  OrderUpdateRequest,
  OrderFilter,
  OrderAnalyticsParam,
  PageableDto,
  PaymentConfirmationRequest,
  RefundRequest,
} from "../data/interfaces";
import { orderService } from "../data/services";
import { message } from "antd";

// Query keys
const ORDER_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_KEYS.all, "list"] as const,
  list: (filters?: OrderFilter, pageable?: PageableDto) =>
    [...ORDER_KEYS.lists(), { filters, pageable }] as const,
  details: () => [...ORDER_KEYS.all, "detail"] as const,
  detail: (orderNumber: string) =>
    [...ORDER_KEYS.details(), orderNumber] as const,
  analytics: () => [...ORDER_KEYS.all, "analytics"] as const,
  analyticsData: (params: OrderAnalyticsParam) =>
    [...ORDER_KEYS.analytics(), params] as const,
  stats: () => [...ORDER_KEYS.all, "stats"] as const,
};

// Order list hook
export const useOrders = (
  pageable?: PageableDto,
  filters?: OrderFilter,
  enabled = true
) => {
  return useQuery({
    queryKey: ORDER_KEYS.list(filters, pageable),
    queryFn: () => orderService.getOrders(pageable, filters),
    enabled,
    placeholderData: (previousData: any) => previousData,
  });
};

// Single order detail hook
export const useOrder = (orderNumber: string) => {
  return useQuery({
    queryKey: ORDER_KEYS.detail(orderNumber),
    queryFn: () => orderService.getOrderByNumber(orderNumber),
    enabled: !!orderNumber,
  });
};

// Search orders hook
export const useSearchOrders = (
  query: string,
  pageable?: PageableDto,
  enabled = true
) => {
  return useQuery({
    queryKey: [...ORDER_KEYS.lists(), "search", query, pageable],
    queryFn: () => orderService.searchOrders(query, pageable),
    enabled: enabled && !!query.trim(),
  });
};

// Orders by customer hook
export const useOrdersByCustomer = (
  customerId: string,
  pageable?: PageableDto
) => {
  return useQuery({
    queryKey: [...ORDER_KEYS.lists(), "customer", customerId, pageable],
    queryFn: () => orderService.getOrdersByCustomer(customerId, pageable),
    enabled: !!customerId,
  });
};

// Orders by status hook
export const useOrdersByStatus = (status: string, pageable?: PageableDto) => {
  return useQuery({
    queryKey: [...ORDER_KEYS.lists(), "status", status, pageable],
    queryFn: () => orderService.getOrdersByStatus(status, pageable),
    enabled: !!status,
  });
};

// Recent orders hook
export const useRecentOrders = (limit = 10) => {
  return useQuery({
    queryKey: [...ORDER_KEYS.lists(), "recent", limit],
    queryFn: () => orderService.getRecentOrders(limit),
  });
};

// Dashboard stats hook
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ORDER_KEYS.stats(),
    queryFn: () => orderService.getOrderDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Analytics hook
export const useOrderAnalytics = (params: OrderAnalyticsParam) => {
  return useQuery({
    queryKey: ORDER_KEYS.analyticsData(params),
    queryFn: () => orderService.getAnalytics(params),
    enabled: !!params.dateFrom && !!params.dateTo,
  });
};

// Mutation hooks

// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: OrderCreateRequest) => orderService.createOrder(order),
    onSuccess: (data) => {
      message.success(`Order ${data.orderNumber} created successfully!`);
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });
    },
    onError: (error: any) => {
      message.error(
        error?.message || "Failed to create order. Please try again."
      );
    },
  });
};

// Update order mutation
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderNumber,
      update,
    }: {
      orderNumber: string;
      update: OrderUpdateRequest;
    }) => orderService.updateOrder(orderNumber, update),
    onSuccess: (data) => {
      message.success(`Order ${data.orderNumber} updated successfully!`);
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });
    },
    onError: (error: any) => {
      message.error(
        error?.message || "Failed to update order. Please try again."
      );
    },
  });
};

// Confirm payment mutation
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderNumber,
      payment,
    }: {
      orderNumber: string;
      payment: PaymentConfirmationRequest;
    }) => orderService.confirmPayment(orderNumber, payment),
    onSuccess: (data) => {
      message.success(`Payment confirmed for order ${data.orderNumber}!`);
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });
    },
    onError: (error: any) => {
      message.error(
        error?.message || "Failed to confirm payment. Please try again."
      );
    },
  });
};

// Process refund mutation
export const useProcessRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderNumber,
      refund,
    }: {
      orderNumber: string;
      refund: RefundRequest;
    }) => orderService.processRefund(orderNumber, refund),
    onSuccess: (data) => {
      message.success(`Refund processed for order ${data.orderNumber}!`);
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });
    },
    onError: (error: any) => {
      message.error(
        error?.message || "Failed to process refund. Please try again."
      );
    },
  });
};

// Bulk operations hooks

// Bulk status update mutation
export const useBulkUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderNumbers,
      status,
    }: {
      orderNumbers: string[];
      status: string;
    }) => {
      const promises = orderNumbers.map((orderNumber) =>
        orderService.updateOrder(orderNumber, { status: status as any })
      );
      return Promise.all(promises);
    },
    onSuccess: (_, { orderNumbers }) => {
      message.success(`Successfully updated ${orderNumbers.length} order(s)!`);
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.all,
      });
    },
    onError: (error: any) => {
      message.error(
        error?.message || "Failed to update orders. Please try again."
      );
    },
  });
};

// Export all hooks for convenience
export const orderHooks = {
  useOrders,
  useOrder,
  useSearchOrders,
  useOrdersByCustomer,
  useOrdersByStatus,
  useRecentOrders,
  useDashboardStats,
  useOrderAnalytics,
  useCreateOrder,
  useUpdateOrder,
  useConfirmPayment,
  useProcessRefund,
  useBulkUpdateOrderStatus,
};
