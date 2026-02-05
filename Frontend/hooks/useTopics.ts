"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios-client";
import type { Topic } from "../lib/types";

export function useTopicSearch() {
    return useQuery({
        queryKey: ["topics"],
        queryFn: async () => {
            const { data } = await apiClient.get("/topic");
            return data as Topic[];
        },
    });
}

// export function useCreateTopic() {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async (topic: Topic) => {
//             const { data } = await apiClient.post("/topic", topic);
//             return data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["topics"] });
//         },
//     });
// }

// export function useUpdateTopic() {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async ({ id, topic }: { id: string; topic: Topic }) => {
//             const { data } = await apiClient.put(`/topic/${id}`, topic);
//             return data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["topics"] });
//         },
//     });
// }

// export function useDeleteTopic() {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async (id: string) => {
//             await apiClient.delete(`/topic/${id}`);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["topics"] });
//         },
//     });
// }
