import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  P2PJourneyDto,
  P2PJourneyCreateRequest,
  P2PJourneyUpdateRequest,
  PageableDto,
  SortDirection,
} from "../data/interfaces";
import { ticketService } from "../data/services";

// Query Keys
const QUERY_KEYS = {
  p2pJourneys: ["p2pJourneys"] as const,
  p2pJourney: (id: string) => ["p2pJourneys", id] as const,
  p2pJourneysPage: (
    page: number,
    size: number,
    sort?: Record<string, SortDirection>,
    filters?: Record<string, any>
  ) => ["p2pJourneys", "page", page, size, sort, filters] as const,
  p2pJourneyByStations: (startStationId: string, endStationId: string) =>
    ["p2pJourneys", "stations", startStationId, endStationId] as const,
};

// Get paginated P2P journeys
export const useP2PJourneys = (
  page: number = 0,
  size: number = 10,
  sort: Record<string, SortDirection> = {},
  filters?: Record<string, any>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.p2pJourneysPage(page, size, sort, filters),
    queryFn: () => ticketService.getP2PJourneys({ page, size, sort }, filters),
  });
};

// Get single P2P journey
export const useP2PJourney = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.p2pJourney(id),
    queryFn: () => ticketService.getP2PJourneyById(id),
    enabled: !!id,
  });
};

// Get P2P journey by stations
export const useP2PJourneyByStations = (
  startStationId: string,
  endStationId: string
) => {
  return useQuery({
    queryKey: QUERY_KEYS.p2pJourneyByStations(startStationId, endStationId),
    queryFn: () =>
      ticketService.getP2PJourneyByStations(startStationId, endStationId),
    enabled: !!startStationId && !!endStationId,
  });
};

// Create P2P journey mutation
export const useCreateP2PJourney = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: P2PJourneyCreateRequest) =>
      ticketService.createP2PJourney(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.p2pJourneys });
      message.success("P2P Journey created successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to create P2P journey");
    },
  });
};

// Update P2P journey mutation
export const useUpdateP2PJourney = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: P2PJourneyUpdateRequest }) =>
      ticketService.updateP2PJourney(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.p2pJourneys });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.p2pJourney(variables.id),
      });
      message.success("P2P Journey updated successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to update P2P journey");
    },
  });
};

// Delete P2P journey mutation
export const useDeactivateP2PJourney = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ticketService.deleteP2PJourney(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.p2pJourneys });
      message.success("P2P Journey deleted successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to delete P2P journey");
    },
  });
};

//Activate P2P journey mutation
export const useActivateP2PJourney = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ticketService.activateP2PJourney(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.p2pJourneys });
      message.success("P2P Journey deleted successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to delete P2P journey");
    },
  });
};
