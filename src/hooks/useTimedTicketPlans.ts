import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  TimedTicketPlanDto,
  TimedTicketPlanCreateRequest,
  TimedTicketPlanUpdateRequest,
  PageableDto,
  SortDirection,
} from "../data/interfaces";
import { ticketService } from "../data/services";

// Query Keys
const QUERY_KEYS = {
  timedTicketPlans: ["timedTicketPlans"] as const,
  timedTicketPlan: (id: string) => ["timedTicketPlans", id] as const,
  timedTicketPlansPage: (
    page: number,
    size: number,
    sort?: Record<string, SortDirection>,
    filters?: Record<string, any>
  ) => ["timedTicketPlans", "page", page, size, sort, filters] as const,
};

// Get paginated timed ticket plans
export const useTimedTicketPlans = (
  page: number = 0,
  size: number = 10,
  sort: Record<string, SortDirection> = {},
  filters?: Record<string, any>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.timedTicketPlansPage(page, size, sort, filters),
    queryFn: () =>
      ticketService.getTimedTicketPlans({ page, size, sort }, filters),
  });
};

// Get single timed ticket plan
export const useTimedTicketPlan = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.timedTicketPlan(id),
    queryFn: () => ticketService.getTimedTicketPlanById(id),
    enabled: !!id,
  });
};

// Create timed ticket plan mutation
export const useCreateTimedTicketPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TimedTicketPlanCreateRequest) =>
      ticketService.createTimedTicketPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timedTicketPlans });
      message.success("Timed Ticket Plan created successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to create timed ticket plan");
    },
  });
};

// Update timed ticket plan mutation
export const useUpdateTimedTicketPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TimedTicketPlanUpdateRequest;
    }) => ticketService.updateTimedTicketPlan(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timedTicketPlans });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.timedTicketPlan(variables.id),
      });
      message.success("Timed Ticket Plan updated successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to update timed ticket plan");
    },
  });
};

// Delete timed ticket plan mutation
export const useDeactivateTimedTicketPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ticketService.deleteTimedTicketPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timedTicketPlans });
      message.success("Timed Ticket Plan deleted successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to delete timed ticket plan");
    },
  });
};

//Activate timed ticket plan mutation
export const useActivateTimedTicketPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ticketService.activateTimedTicketPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.timedTicketPlans });
      message.success("Timed Ticket Plan activated successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to activate timed ticket plan");
    },
  });
};
