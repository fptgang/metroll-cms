import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  TicketValidationDto,
  TicketValidationCreateRequest,
  TicketValidationFilter,
  PageableDto,
  SortDirection,
} from "../data/interfaces";
import { ticketService } from "../data/services";

// Query Keys
const QUERY_KEYS = {
  validations: ["ticket-validations"] as const,
  validation: (id: string) => ["ticket-validations", id] as const,
  validationsPage: (
    page: number,
    size: number,
    sort?: Record<string, SortDirection>,
    filters?: TicketValidationFilter
  ) => ["ticket-validations", "page", page, size, sort, filters] as const,
  validationsByTicket: (ticketId: string) =>
    ["ticket-validations", "ticket", ticketId] as const,
  validationsByStation: (
    stationCode: string,
    page: number,
    size: number,
    sort?: Record<string, SortDirection>,
    filters?: any
  ) =>
    [
      "ticket-validations",
      "station",
      stationCode,
      page,
      size,
      sort,
      filters,
    ] as const,
};

// Get paginated ticket validations
export const useTicketValidations = (
  page: number = 0,
  size: number = 10,
  sort: Record<string, SortDirection> = {},
  filters?: TicketValidationFilter
) => {
  return useQuery({
    queryKey: QUERY_KEYS.validationsPage(page, size, sort, filters),
    queryFn: () => ticketService.getTicketValidations({ page, size, sort }, filters),
  });
};

// Get single ticket validation by ID
export const useTicketValidation = (id: string, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.validation(id),
    queryFn: () => ticketService.getTicketValidationById(id),
    enabled,
  });
};

// Get ticket validations by ticket ID
export const useTicketValidationsByTicket = (
  ticketId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: QUERY_KEYS.validationsByTicket(ticketId),
    queryFn: () => ticketService.getTicketValidationsByTicketId(ticketId),
    enabled,
  });
};

// Get ticket validations by station
export const useTicketValidationsByStation = (
  stationCode: string,
  page: number = 0,
  size: number = 10,
  sort: Record<string, SortDirection> = {},
  filters?: any,
  enabled = true
) => {
  return useQuery({
    queryKey: QUERY_KEYS.validationsByStation(stationCode, page, size, sort, filters),
    queryFn: () => ticketService.getTicketValidationsByStationCode(stationCode, { page, size, sort }, filters),
    enabled: enabled && !!stationCode,
  });
};

// Validate ticket mutation
export const useValidateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (validation: TicketValidationCreateRequest) =>
      ticketService.validateTicket(validation),
    onSuccess: (data) => {
      message.success("Ticket validated successfully");

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.validations,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.validationsByTicket(data.ticketId),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to validate ticket";
      message.error(errorMessage);
    },
  });
};
