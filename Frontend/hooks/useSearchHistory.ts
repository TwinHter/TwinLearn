"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios-client";
import type { SearchHistory } from "../lib/types";

export function useSearchHistory() {
    return useQuery({
        queryKey: ["searchHistory"],
        queryFn: async () => {
            const { data } =
                await apiClient.get<SearchHistory[]>("/searchhistory");
            return data.slice(0, 20);
        },
    });
}

// export function useCreateSearchHistory() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async (dto: CreateSearchHistoryDto) => {
//       const { data } = await apiClient.post<SearchHistory>("/searchhistory", dto)
//       return data
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["searchHistory"] })
//     },
//   })
// }

export function useDeleteHistoryItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/searchhistory/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["searchHistory"] });
        },
    });
}
