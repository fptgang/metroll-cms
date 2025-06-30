import { useQuery } from "@tanstack/react-query";
import {
  AccountDashboard,
  TicketDashboard,
  SubwayDashboard,
  OrderDashboard,
} from "../data/interfaces";
import {
  accountService,
  ticketService,
  subwayService,
  orderService,
} from "../data/services";

// Query Keys
const QUERY_KEYS = {
  accountDashboard: ["dashboard", "accounts"] as const,
  ticketDashboard: ["dashboard", "tickets"] as const,
  subwayDashboard: ["dashboard", "subway"] as const,
  orderDashboard: ["dashboard", "orders"] as const,
};

// Account Dashboard Hook
export const useAccountDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.accountDashboard,
    queryFn: () => accountService.getAccountDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
};

// Ticket Dashboard Hook
export const useTicketDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ticketDashboard,
    queryFn: () => ticketService.getTicketDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for ticket data)
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
  });
};

// Subway Dashboard Hook
export const useSubwayDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.subwayDashboard,
    queryFn: () => subwayService.getSubwayDashboard(),
    staleTime: 10 * 60 * 1000, // 10 minutes (infrastructure changes less frequently)
    refetchInterval: 10 * 60 * 1000, // Auto-refresh every 10 minutes
  });
};

// Order Dashboard Hook
export const useOrderDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.orderDashboard,
    queryFn: () => orderService.getOrderDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes (financial data needs to be fresh)
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
  });
};

// Combined Dashboard Hook (fetches all dashboard data)
export const useAllDashboards = () => {
  const accountDashboard = useAccountDashboard();
  const ticketDashboard = useTicketDashboard();
  const subwayDashboard = useSubwayDashboard();
  const orderDashboard = useOrderDashboard();

  return {
    accounts: accountDashboard,
    tickets: ticketDashboard,
    subway: subwayDashboard,
    orders: orderDashboard,
    isLoading:
      accountDashboard.isLoading ||
      ticketDashboard.isLoading ||
      subwayDashboard.isLoading ||
      orderDashboard.isLoading,
    error:
      accountDashboard.error ||
      ticketDashboard.error ||
      subwayDashboard.error ||
      orderDashboard.error,
  };
};
