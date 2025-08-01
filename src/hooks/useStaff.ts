import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { AccountFilter, StationAssignmentRequest, SortDirection } from "../data/interfaces";
import { accountService } from "../data/services";

// Query Keys
const QUERY_KEYS = {
  staffs: ["staffs"] as const,
  staff: (id: string) => ["staffs", id] as const,
  staffsPage: (page: number, size: number, sort?: Record<string, SortDirection>, filters?: AccountFilter) =>
    ["staffs", "page", page, size, sort, filters] as const,
};

// Get all staff members
export const useStaff = (
  page: number = 0,
  size: number = 10,
  sort: Record<string, SortDirection> = {},
  filters?: AccountFilter
) => {
  return useQuery({
    queryKey: QUERY_KEYS.staffsPage(page, size, sort, filters),
    enabled: page >= 0 && size > 0, // Ensure valid pagination
    queryFn: () => accountService.getStaffs({ page, size, sort }, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Assign station to staff mutation
export const useAssignStationToStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      request,
    }: {
      staffId: string;
      request: StationAssignmentRequest;
    }) => accountService.assignStationToStaff(staffId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffs });
      message.success("Station assigned successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to assign station");
    },
  });
};
