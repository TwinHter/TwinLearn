"use client";

import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/axios-client";
import type {
    AiRequest,
    AiResponse,
    KbFixBugResponse,
    AnalysisParsedResult,
    KbFixBugRequest,
} from "../lib/types";
import {
    AnalysisResultParsed,
    KbSolverRequest,
    KbSolverResponseRaw,
} from "../lib/kb-data";

export function useAnalyzeCode() {
    return useMutation({
        mutationFn: async (request: AiRequest) => {
            const { data } = await apiClient.post("/ai/gemini", request);
            return data as AiResponse;
        },
    });
}

export function useKbFixBug() {
    return useMutation<AnalysisParsedResult, Error, KbFixBugRequest>({
        mutationFn: async (request: KbFixBugRequest) => {
            const { data } = await apiClient.post<KbFixBugResponse>(
                "/ai/kb-fix-bug",
                request
            );

            try {
                if (!data.analysisResult) {
                    throw new Error(
                        "Không nhận được kết quả phân tích từ server"
                    );
                }

                const parsedResult: AnalysisParsedResult = JSON.parse(
                    data.analysisResult
                );
                console.log("Parsed AI Response:", parsedResult);
                return parsedResult;
            } catch (error) {
                console.error("Lỗi parse JSON từ AI Response:", error);

                return {
                    status: "Failed",
                    raw_log: data.analysisResult || "Lỗi Server",
                } as AnalysisParsedResult;
            }
        },
        onError: (error) => {
            console.error("Lỗi khi gọi API FixBug:", error);
        },
    });
}

export function useKbSolver() {
    return useMutation<AnalysisResultParsed, Error, KbSolverRequest>({
        mutationFn: async (payload: KbSolverRequest) => {
            // Lưu ý: Endpoint thường là /ai/kb-solver nếu apiClient đã có baseURL
            const { data } = await apiClient.post<KbSolverResponseRaw>(
                "/ai/kb-solver",
                payload
            );

            // Kiểm tra dữ liệu thô
            if (!data.analysisResult) {
                throw new Error("Không nhận được kết quả phân tích từ server.");
            }

            // Parse JSON lồng nhau (String -> Object)
            try {
                const parsedResult: AnalysisResultParsed = JSON.parse(
                    data.analysisResult
                );
                return parsedResult;
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                throw new Error(
                    "Dữ liệu trả về từ Python không đúng định dạng JSON."
                );
            }
        },
        onError: (error) => {
            console.error("Solver API Error:", error);
        },
    });
}
