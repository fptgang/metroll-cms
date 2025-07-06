import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  DiscountPackageDto,
  AccountDiscountPackageDto,
  DiscountPackageCreateRequest,
  DiscountPackageUpdateRequest,
  AccountDiscountAssignRequest,
  DiscountPackageFilter,
  AccountDiscountPackageFilter,
  PageableDto,
} from "../data/interfaces";
import { discountService } from "../data/services";

// Query Keys
const QUERY_KEYS = {
  discountPackages: ["discount-packages"] as const,
  discountPackage: (id: string) => ["discount-packages", id] as const,
  discountPackagesPage: (
    page: number,
    size: number,
    filters?: DiscountPackageFilter
  ) => ["discount-packages", "page", page, size, filters] as const,
  accountDiscountPackages: ["account-discount-packages"] as const,
  accountDiscountPackage: (id: string) =>
    ["account-discount-packages", id] as const,
  accountDiscountPackagesPage: (
    page: number,
    size: number,
    filters?: AccountDiscountPackageFilter
  ) => ["account-discount-packages", "page", page, size, filters] as const,
};

// Discount Package Hooks

// Get paginated discount packages
export const useDiscountPackages = (
  page: number = 0,
  size: number = 10,
  filters?: DiscountPackageFilter
) => {
  return useQuery({
    queryKey: QUERY_KEYS.discountPackagesPage(page, size, filters),
    queryFn: () => discountService.getDiscountPackages({ page, size }, filters),
  });
};

// Get single discount package
export const useDiscountPackage = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.discountPackage(id),
    queryFn: () => discountService.getDiscountPackageById(id),
    enabled: !!id,
  });
};

// Create discount package mutation
export const useCreateDiscountPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DiscountPackageCreateRequest) =>
      discountService.createDiscountPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.discountPackages });
      message.success("Discount package created successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to create discount package");
    },
  });
};

// Update discount package mutation
export const useUpdateDiscountPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: DiscountPackageUpdateRequest;
    }) => discountService.updateDiscountPackage(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.discountPackages,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.discountPackage(variables.id),
      });
      message.success("Discount package updated successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to update discount package");
    },
  });
};

// Terminate discount package mutation
export const useTerminateDiscountPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => discountService.terminateDiscountPackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.discountPackages,
      });
      message.success("Discount package terminated successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to terminate discount package");
    },
  });
};

// Account Discount Package Hooks

// Get paginated account discount packages
export const useAccountDiscountPackages = (
  page: number = 0,
  size: number = 10,
  filters?: AccountDiscountPackageFilter
) => {
  return useQuery({
    queryKey: QUERY_KEYS.accountDiscountPackagesPage(page, size, filters),
    queryFn: () =>
      discountService.getAccountDiscountPackages({ page, size }, filters),
  });
};

// Get single account discount package
export const useAccountDiscountPackage = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.accountDiscountPackage(id),
    queryFn: () => discountService.getAccountDiscountPackageById(id),
    enabled: !!id,
  });
};

// Get account discount package by account ID
export const useAccountDiscountPackageByAccountId = (accountId: string) => {
  return useQuery({
    queryKey: ["account-discount-packages", "account", accountId],
    queryFn: () =>
      discountService.getAccountDiscountPackageByAccountId(accountId),
    enabled: !!accountId,
  });
};

// Assign discount package to account mutation
export const useAssignDiscountPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AccountDiscountAssignRequest) =>
      discountService.assignDiscountPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.accountDiscountPackages,
      });
      message.success("Discount package assigned successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to assign discount package");
    },
  });
};

// Unassign discount package from account mutation
export const useUnassignDiscountPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => discountService.unassignDiscountPackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.accountDiscountPackages,
      });
      message.success("Discount package unassigned successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to unassign discount package");
    },
  });
};
