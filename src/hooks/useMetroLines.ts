import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  MetroLineDto,
  MetroLineRequest,
  MetroLineFilter,
  PageableDto,
  SortDirection,
} from "../data/interfaces";
import { subwayService } from "../data/services";

// Query Keys
const QUERY_KEYS = {
  metroLines: ["metroLines"] as const,
  metroLine: (code: string) => ["metroLines", code] as const,
  metroLinesPage: (page: number, size: number, sort?: Record<string, SortDirection>, filters?: MetroLineFilter) =>
    ["metroLines", "page", page, size, sort, filters] as const,
};

// Get paginated metro lines
export const useMetroLines = (
  page: number = 0,
  size: number = 10,
  sort: Record<string, SortDirection> = {},
  filters?: MetroLineFilter
) => {
  return useQuery({
    queryKey: QUERY_KEYS.metroLinesPage(page, size, sort, filters),
    queryFn: () => subwayService.getMetroLines({ page, size, sort }, filters),
  });
};

// Get single metro line by code
export const useMetroLine = (code: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.metroLine(code),
    queryFn: () => subwayService.getMetroLineByCode(code),
    enabled: !!code,
  });
};

// Create metro line mutation
export const useCreateMetroLine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MetroLineRequest) => subwayService.createMetroLine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.metroLines });
      message.success("Metro line created successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to create metro line");
    },
  });
};

// Update metro line mutation
export const useUpdateMetroLine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: MetroLineRequest }) =>
      subwayService.updateMetroLine(code, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.metroLines });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.metroLine(variables.code),
      });
      message.success("Metro line updated successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to update metro line");
    },
  });
};

// Search metro lines
export const useSearchMetroLines = (
  query: string,
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: ["metroLines", "search", query, page, size],
    queryFn: () => subwayService.searchMetroLines(query, { page, size }),
    enabled: !!query && query.length >= 2, // Only search when query has at least 2 characters
  });
};
