import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { StationDto, StationFilter, PageableDto, SortDirection } from "../data/interfaces";
import { subwayService } from "../data/services";

// Query Keys
const QUERY_KEYS = {
  stations: ["stations"] as const,
  station: (code: string) => ["stations", code] as const,
  stationsPage: (page: number, size: number, sort?: Record<string, SortDirection>, filters?: StationFilter) =>
    ["stations", "page", page, size, sort, filters] as const,
  operationalStations: ["stations", "operational"] as const,
};

// Get paginated stations
export const useStations = (
  page: number = 0,
  size: number = 10,
  sort: Record<string, SortDirection> = {},
  filters?: StationFilter
) => {
  return useQuery({
    queryKey: QUERY_KEYS.stationsPage(page, size, sort, filters),
    queryFn: () => subwayService.getStations({ page, size, sort }, filters),
  });
};

// Get single station by code
export const useStation = (code: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.station(code),
    queryFn: () => subwayService.getStationByCode(code),
    enabled: !!code,
  });
};

// Get all operational stations (for dropdowns/selectors)
export const useOperationalStations = () => {
  return useQuery({
    queryKey: QUERY_KEYS.operationalStations,
    queryFn: () => subwayService.getOperationalStations(),
    staleTime: 5 * 60 * 1000, // 5 minutes - stations don't change frequently
  });
};

// Create or update station mutation
export const useSaveStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StationDto) => subwayService.saveStation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stations });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.operationalStations,
      });
      message.success("Station saved successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to save station");
    },
  });
};

// Bulk create stations mutation
export const useBulkCreateStations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stations: StationDto[]) =>
      subwayService.bulkCreateStations(stations),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stations });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.operationalStations,
      });
      message.success(`${data.length} stations created successfully!`);
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to create stations");
    },
  });
};

// Search stations
export const useSearchStations = (
  query: string,
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: ["stations", "search", query, page, size],
    queryFn: () => subwayService.searchStations(query, { page, size }),
    enabled: !!query && query.length >= 2, // Only search when query has at least 2 characters
  });
};
