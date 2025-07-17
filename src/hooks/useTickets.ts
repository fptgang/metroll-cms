import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  TicketDto,
  TicketUpsertRequest,
  TicketFilter,
  TicketStatus,
  PageableDto,
  SortDirection,
} from "../data/interfaces";
import { ticketService } from "../data/services";

// Query Keys
const QUERY_KEYS = {
  tickets: ["tickets"] as const,
  ticket: (id: string) => ["tickets", id] as const,
  ticketsPage: (page: number, size: number, sort?: Record<string, SortDirection>, filters?: TicketFilter) =>
    ["tickets", "page", page, size, sort, filters] as const,
  ticketByNumber: (ticketNumber: string) =>
    ["tickets", "number", ticketNumber] as const,
};

// Get paginated tickets
export const useTickets = (
  page: number = 0,
  size: number = 10,
  sort?: Record<string, SortDirection>,
  filters?: TicketFilter
) => {
  return useQuery({
    queryKey: QUERY_KEYS.ticketsPage(page, size, sort, filters),
    queryFn: () => ticketService.getTickets({ page, size, sort }, filters),
  });
};

// Get single ticket
export const useTicket = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ticket(id),
    queryFn: () => ticketService.getTicketById(id),
    enabled: !!id,
  });
};

// Get ticket by number
export const useTicketByNumber = (ticketNumber: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ticketByNumber(ticketNumber),
    queryFn: () => ticketService.getTicketByNumber(ticketNumber),
    enabled: !!ticketNumber,
  });
};

// Create ticket mutation
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TicketUpsertRequest) => ticketService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets });
      message.success("Ticket created successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to create ticket");
    },
  });
};

// Update ticket status mutation
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      ticketService.updateTicketStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ticket(variables.id),
      });
      message.success("Ticket status updated successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to update ticket status");
    },
  });
};

// Search tickets
export const useSearchTickets = (
  query: string,
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: ["tickets", "search", query, page, size],
    queryFn: () => ticketService.searchTickets(query, { page, size }),
    enabled: !!query,
  });
};
