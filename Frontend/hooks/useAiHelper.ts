"use client";

import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/axios-client";
import {
    GeminiRequest,
    GeminiResponse,
    KbFixBugRequest,
    KbFixBugResponse,
    KbSolverRequest,
    KbSolverResponse,
    ParsedFixBugAnalysis,
    KbFixBugItem,
    ParsedSolverAnalysis,
} from "../lib/ai-types";

export function useAnalyzeCode() {
    return useMutation({
        mutationFn: async (request: GeminiRequest) => {
            const { data } = await apiClient.post<GeminiResponse>(
                "/ai/gemini",
                request,
            );
            return data;
        },
    });
}

export function useKbFixBug() {
    // Đổi AnalysisParsedResult -> ParsedFixBugAnalysis
    return useMutation<ParsedFixBugAnalysis, Error, KbFixBugRequest>({
        mutationFn: async (request: KbFixBugRequest) => {
            const { data } = await apiClient.post<KbFixBugResponse>(
                "/ai/kb-fix-bug",
                request,
            );

            try {
                console.log("Raw AI Response:", data);
                const parsedResult = JSON.parse(
                    data.analysisResult,
                ) as KbFixBugItem[];
                return {
                    ...data,
                    analysisResult: parsedResult,
                    error: data.error,
                } as ParsedFixBugAnalysis;
            } catch (error) {
                console.error("Lỗi parse JSON từ AI Response:", error);
                return {
                    status: "SystemFailed",
                    raw_log: data.analysisResult || "Lỗi Server",
                    error: data.error,
                    createdAt: data.createdAt,
                    processingTimeMs: data.processingTimeMs,
                } as ParsedFixBugAnalysis;
            }
        },
        onError: (error) => {
            console.error("Lỗi khi gọi API FixBug:", error);
        },
    });
}

export function useKbSolver() {
    return useMutation<ParsedSolverAnalysis, Error, KbSolverRequest>({
        mutationFn: async (payload: KbSolverRequest) => {
            const { data } = await apiClient.post<KbSolverResponse>(
                "/ai/kb-solver",
                payload,
            );

            try {
                console.log("Raw Solver AI Response:", data);
                let steps: { id: string; description: string }[] = [];

                try {
                    const parsed = JSON.parse(data.analysisResult);
                    if (Array.isArray(parsed)) {
                        steps = parsed;
                    }
                } catch (error) {}
                console.log("Parsed Steps:", steps);

                return {
                    ...data,
                    processingTimeMs: data.processingTimeMs,
                    createdAt: data.createdAt,
                    type: payload.type,
                    steps,
                    error: data.error,
                } as ParsedSolverAnalysis;
            } catch (error) {
                return {
                    status: "SystemFailed",
                    type: payload.type,
                    error: "Lỗi phân tích kết quả từ AI",
                    createdAt: data.createdAt,
                    processingTimeMs: data.processingTimeMs,
                } as ParsedSolverAnalysis;
            }
        },
        onError: (error) => {
            console.error("Solver API Error:", error);
        },
    });
}
