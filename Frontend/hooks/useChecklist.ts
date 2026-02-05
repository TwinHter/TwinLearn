"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/axios-client";
import type {
    ChecklistItem,
    CreateChecklistDto,
    UpdateChecklistDto,
} from "../lib/types";

export function useChecklist() {
    return useQuery({
        queryKey: ["checklist"],
        queryFn: async () => {
            const { data } = await apiClient.get<ChecklistItem[]>("/checklist");
            return data;
        },
    });
}

export function useAddChecklistItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (item: CreateChecklistDto) => {
            const { data } = await apiClient.post<ChecklistItem>(
                "/checklist",
                item
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checklist"] });
        },
    });
}

export function useUpdateChecklistItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            ...dto
        }: { id: number } & UpdateChecklistDto) => {
            const { data } = await apiClient.put<ChecklistItem>(
                `/checklist/${id}`,
                dto
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checklist"] });
        },
    });
}

export function useDeleteChecklistItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/checklist/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checklist"] });
        },
    });
}
