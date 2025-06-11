import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import {
  AccountDto,
  AccountCreateRequest,
  AccountUpdateRequest,
  AccountFilter,
  PageableDto,
} from "../data/interfaces";
import { accountService } from "../data/services";

// Query Keys
const QUERY_KEYS = {
  accounts: ["accounts"] as const,
  account: (id: string) => ["accounts", id] as const,
  accountsPage: (page: number, size: number, filters?: AccountFilter) =>
    ["accounts", "page", page, size, filters] as const,
};

// Get paginated accounts
export const useAccounts = (
  page: number = 0,
  size: number = 10,
  filters?: AccountFilter
) => {
  return useQuery({
    queryKey: QUERY_KEYS.accountsPage(page, size, filters),
    queryFn: () => accountService.getAccounts({ page, size }, filters),
  });
};

// Get single account
export const useAccount = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.account(id),
    queryFn: () => accountService.getAccountById(id),
    enabled: !!id,
  });
};

// Create account mutation
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AccountCreateRequest) =>
      accountService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      message.success("Account created successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to create account");
    },
  });
};

// Update account mutation
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AccountUpdateRequest }) =>
      accountService.updateAccount(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.account(variables.id),
      });
      message.success("Account updated successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to update account");
    },
  });
};

// Delete account mutation
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountService.deactivateAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.accounts });
      message.success("Account deleted successfully!");
    },
    onError: (error: any) => {
      message.error(error?.error || "Failed to delete account");
    },
  });
};

// Search accounts
export const useSearchAccounts = (
  query: string,
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: ["accounts", "search", query, page, size],
    queryFn: () => accountService.searchAccounts(query, { page, size }),
    enabled: !!query,
  });
};
