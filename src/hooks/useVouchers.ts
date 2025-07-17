import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  VoucherDto,
  VoucherCreateRequest,
  VoucherUpdateRequest,
  VoucherFilter,
  VoucherStatus,
  PageableDto, SortDirection,
} from "../data/interfaces";
import { voucherService } from "../data/services";

// Query Keys
const QUERY_KEYS = {
  vouchers: ["vouchers"] as const,
  voucher: (id: string) => ["vouchers", id] as const,
  vouchersPage: (page: number, size: number, sort?: Record<string, SortDirection>, filters?: VoucherFilter) =>
    ["vouchers", "page", page, size, sort, filters] as const,
  voucherByCode: (code: string) => ["vouchers", "code", code] as const,
};

// Get paginated vouchers
export const useVouchers = (
  page: number = 0,
  size: number = 10,
  sort: Record<string, SortDirection> = {},
  filters?: VoucherFilter
) => {
  return useQuery({
    queryKey: QUERY_KEYS.vouchersPage(page, size, sort, filters),
    queryFn: () => voucherService.getVouchers({ page, size, sort }, filters),
  });
};

// Get single voucher
export const useVoucher = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.voucher(id),
    queryFn: () => voucherService.getVoucherById(id),
    enabled: !!id,
  });
};

// Get voucher by code
export const useVoucherByCode = (code: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.voucherByCode(code),
    queryFn: () => voucherService.getVoucherByCode(code),
    enabled: !!code,
  });
};

// Create voucher mutation
export const useCreateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VoucherCreateRequest) =>
      voucherService.createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vouchers });
      message.success("Voucher created successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to create voucher");
    },
  });
};

// Update voucher mutation
export const useUpdateVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VoucherUpdateRequest }) =>
      voucherService.updateVoucher(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vouchers });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.voucher(variables.id),
      });
      message.success("Voucher updated successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to update voucher");
    },
  });
};

// Delete voucher mutation
export const useDeleteVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => voucherService.deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vouchers });
      message.success("Voucher deleted successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to delete voucher");
    },
  });
};

// Update voucher status mutation
export const useUpdateVoucherStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: VoucherStatus }) =>
      voucherService.updateVoucherStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vouchers });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.voucher(variables.id),
      });
      message.success("Voucher status updated successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to update voucher status");
    },
  });
};

// Search vouchers
export const useSearchVouchers = (
  query: string,
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: ["vouchers", "search", query, page, size],
    queryFn: () => voucherService.searchVouchers(query, { page, size }),
    enabled: !!query,
  });
};
