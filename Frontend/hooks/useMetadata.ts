"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios-client";
import { SolverData } from "../lib/kb-data"; // Đảm bảo import đúng đường dẫn file types

export const useSolverData = () => {
    return useQuery<SolverData>({
        queryKey: ["kb-solver-metadata"], // Key định danh để cache dữ liệu
        queryFn: async () => {
            // 1. Gọi API bằng apiClient (axios)
            // Axios tự động ném lỗi nếu status != 200, và tự parse JSON
            const { data: rawData } = await apiClient.get(
                "/metadata/kb-solver"
            );

            console.log("Raw Data from Backend:", rawData);

            // 2. Mapping dữ liệu (Logic giữ nguyên như cũ)
            const mappedData: SolverData = {
                // Lọc input (type = initial)
                inputTypes: rawData.states
                    .filter((s: any) => s.type === "initial")
                    .map((s: any) => ({
                        id: s.id,
                        label: s.label || s.description,
                    })),

                // Lọc output (type = goal)
                outputTypes: rawData.states
                    .filter((s: any) => s.type === "goal")
                    .map((s: any) => ({
                        id: s.id,
                        label: s.label || s.description,
                    })),

                // Map Steps
                steps: rawData.steps.map((s: any) => ({
                    id: s.id,
                    label: s.description,
                })),

                // Map Problems
                problems: rawData.PROBLEMS.map((p: any) => {
                    const goalState = rawData.states.find(
                        (s: any) => s.id === p.goal
                    );

                    return {
                        id: p.id,
                        title: p.title,
                        // Nối mảng thành chuỗi để hiển thị trên UI (ví dụ: "n + Array")
                        inputId: Array.isArray(p.initial_states)
                            ? p.initial_states.join(" + ")
                            : p.initial_states,
                        outputId: p.goal,
                        description: goalState
                            ? goalState.description
                            : p.title,
                        correctSteps: [],
                    };
                }),
            };

            return mappedData;
        },
        // Cache dữ liệu này trong 5 phút (vì metadata ít khi thay đổi)
        staleTime: 1000 * 60 * 5,
        // Nếu lỗi, không retry quá nhiều lần để tránh spam server
        retry: 1,
    });
};
