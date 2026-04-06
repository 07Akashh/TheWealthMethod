import { 
  useMutation, 
  useQuery, 
  useQueryClient, 
  UseQueryOptions, 
  UseMutationOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import { sqliteService, Transaction, Goal, CategoryBreakdown, WeeklyTrend, DashboardStats, ComparisonInfo } from "../../services/sqliteService";

/**
 * SQL Query Keys for consistent invalidation
 */
export const SQL_QUERY_KEYS = {
  TRANSACTIONS: ["transactions"],
  DASHBOARD: ["dashboard_stats"],
  INSIGHTS: ["insights"],
  GOALS: ["goals"],
};

/**
 * Base SQLite Hook Engine
 * Provides automatic background refreshing on focus
 */
function useSqliteQuery<T>(
    queryKey: any[], 
    queryFn: () => Promise<T>,
    options?: any
): UseQueryResult<T, Error> {
    const isFocused = useIsFocused();
    const query = useQuery<T>({
        queryKey,
        queryFn,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        ...options,
    });

    useFocusEffect(
        useCallback(() => {
            if (isFocused) {
                query.refetch();
            }
        }, [isFocused, query])
    );

    return query;
}

/**
 * 📊 TRANSACTIONS HOOKS
 */
export function useTransactions(filter?: { type?: string; category?: string }) {
  return useSqliteQuery(
    [...SQL_QUERY_KEYS.TRANSACTIONS, filter],
    () => sqliteService.getTransactions(filter)
  );
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tx: Omit<Transaction, "id">) => sqliteService.insertTransaction(tx),
    onSuccess: () => {
      // Invalidate everything associated with the ledger
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.TRANSACTIONS });
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.DASHBOARD });
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.INSIGHTS });
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.GOALS });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tx: Transaction) => sqliteService.updateTransaction(tx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.TRANSACTIONS });
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.DASHBOARD });
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.INSIGHTS });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sqliteService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.TRANSACTIONS });
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.DASHBOARD });
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.INSIGHTS });
    },
  });
}

/**
 * 🏠 DASHBOARD HOOKS
 */
export function useDashboardStats() {
  return useSqliteQuery<DashboardStats>(
    SQL_QUERY_KEYS.DASHBOARD,
    () => sqliteService.getDashboardStats()
  );
}

/**
 * 📈 ANALYTICS HOOKS
 */
export function useInsights() {
  return useSqliteQuery<{ breakdown: CategoryBreakdown[]; trends: WeeklyTrend[]; comparison: ComparisonInfo }>(
    SQL_QUERY_KEYS.INSIGHTS,
    async () => {
      const breakdown = await sqliteService.getCategoryBreakdown();
      const trends = await sqliteService.getWeeklyTrends();
      const comparison = await sqliteService.getComparisonInfo();
      return { breakdown, trends, comparison };
    }
  );
}

/**
 * 🎯 GOALS HOOKS
 */
export function useGoals(): UseQueryResult<Goal[], Error> {
  return useSqliteQuery<Goal[]>(
    SQL_QUERY_KEYS.GOALS,
    () => sqliteService.getGoals()
  );
}

export function useUpsertGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goal: Omit<Goal, "id" | "streak" | "lastUpdated"> & { id?: string }) => sqliteService.upsertGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.GOALS });
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.DASHBOARD });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sqliteService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SQL_QUERY_KEYS.GOALS });
    },
  });
}
