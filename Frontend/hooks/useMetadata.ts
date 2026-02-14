"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/axios-client";
import { SolverData } from "../lib/types";

export const useSolverData = () => {
    return useQuery<SolverData>({
        queryKey: ["kb-solver-metadata"],
        queryFn: async () => {
            const { data: rawData } = await apiClient.get(
                "/metadata/kb-solver",
            );

            const mappedData: SolverData = {
                inputTypes: rawData.inputStates, // Đã là mảng {id, label}
                outputTypes: rawData.outputStates, // Đã là mảng {id, label}
                steps: rawData.steps, // Đã là mảng {id, label}

                problems: rawData.problems.map((p: any) => {
                    return {
                        id: p.id,
                        title: p.title,
                        outputId: p.goal,
                        inputIds: (p.initialStates || []).map(
                            (stateId: string) => {
                                const foundState = rawData.inputStates.find(
                                    (s: any) => s.id === stateId,
                                );
                                return {
                                    id: stateId,
                                    label: foundState
                                        ? foundState.label
                                        : stateId,
                                };
                            },
                        ),
                    };
                }),
            };

            return mappedData;
        },
        staleTime: 1000 * 60 * 5, // Cache 5 phút
        retry: 1,
    });
};
