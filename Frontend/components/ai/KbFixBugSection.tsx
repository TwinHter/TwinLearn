"use client";

import { useState } from "react";
import {
    Loader2,
    Bug,
    CheckCircle,
    AlertTriangle,
    FileCode,
    Clock,
    Terminal,
    AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { useKbFixBug } from "../../hooks/useAiHelper";
import type { KbFixBugItem } from "../../lib/ai-types";

export default function KbFixBugSection() {
    const [code, setCode] = useState<string>("");
    const { mutate, isPending, data: result } = useKbFixBug();

    const handleAnalyze = () => {
        if (!code.trim()) return;
        mutate({ sourceCode: code });
    };

    // Helper để xác định màu và text dựa trên status
    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case "success":
                return {
                    color: "bg-green-100 text-green-700 border-green-200",
                    label: "Code Sạch",
                    icon: <CheckCircle className="w-4 h-4" />,
                };
            case "error":
                return {
                    color: "bg-red-100 text-red-700 border-red-200",
                    label: "Phát hiện lỗi",
                    icon: <AlertCircle className="w-4 h-4" />,
                };
            case "failed":
                return {
                    color: "bg-amber-100 text-amber-700 border-amber-200",
                    label: "Lỗi Hệ thống",
                    icon: <AlertTriangle className="w-4 h-4" />,
                };
            default:
                return {
                    color: "bg-slate-100 text-slate-700 border-slate-200",
                    label: status,
                    icon: <Terminal className="w-4 h-4" />,
                };
        }
    };

    return (
        <div className="flex flex-col gap-6 h-full p-4">
            {/* --- Input Area --- */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md">
                            <FileCode className="w-4 h-4" />
                        </div>
                        Source Code (C/C++)
                    </label>
                    <Button
                        onClick={handleAnalyze}
                        disabled={isPending || !code.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 shadow-sm transition-all active:scale-95"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang phân tích...
                            </>
                        ) : (
                            <>
                                <Bug className="w-4 h-4 mr-2" /> Kiểm tra lỗi
                            </>
                        )}
                    </Button>
                </div>

                <div className="relative">
                    <textarea
                        className="w-full h-56 p-4 font-mono text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-none transition-all"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="// Nhập code C++ của bạn vào đây..."
                        spellCheck={false}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
                        {code.length} ký tự
                    </div>
                </div>
            </div>

            {/* --- Results Area --- */}
            {result && (
                <div className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Status Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Kết quả phân tích
                        </h3>
                        {(() => {
                            const statusInfo = getStatusInfo(result.status);
                            return (
                                <span
                                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${statusInfo.color}`}
                                >
                                    {statusInfo.icon}
                                    {statusInfo.label}
                                </span>
                            );
                        })()}
                    </div>

                    {/* Case 1: Success (Code Sạch) */}
                    {result.status.toLowerCase() === "success" && (
                        <div className="p-8 bg-green-50/80 text-green-800 rounded-2xl border border-green-100 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="text-lg font-bold text-green-700">
                                Code Hợp Lệ!
                            </h4>
                            <p className="text-sm text-green-600/80 mt-1">
                                Không tìm thấy lỗi cú pháp nào trong đoạn code
                                của bạn.
                            </p>
                        </div>
                    )}

                    {/* Case 2: Error (Có lỗi cú pháp) */}
                    {result.status.toLowerCase() === "error" &&
                        result.analysisResult && (
                            <div className="grid gap-3">
                                {result.analysisResult.map((err, idx) => (
                                    <ErrorCard key={idx} error={err} />
                                ))}
                            </div>
                        )}

                    {/* Case 3: Failed / Raw Log (Lỗi parse hoặc lỗi hệ thống) */}
                    {(result.status.toLowerCase() === "failed" ||
                        (!result.analysisResult &&
                            result.status.toLowerCase() !== "success")) && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-2 text-slate-500 font-mono text-xs uppercase tracking-wider font-bold">
                                <Terminal className="w-4 h-4" /> Raw Output Log
                            </div>
                            <pre className="font-mono text-xs text-red-600 bg-white p-4 rounded-lg border border-red-100 overflow-x-auto whitespace-pre-wrap">
                                {result.raw_log ||
                                    "Không có dữ liệu log trả về."}
                            </pre>
                        </div>
                    )}

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-end gap-4 text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {result.processingTimeMs
                                ? `${result.processingTimeMs.toFixed(2)}ms`
                                : "N/A"}
                        </span>
                        <span>•</span>
                        <span>
                            {new Date(result.createdAt).toLocaleString("vi-VN")}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-component: Thẻ hiển thị từng lỗi
function ErrorCard({ error }: { error: KbFixBugItem }) {
    const isError = error.level?.toLowerCase().includes("error");

    return (
        <div
            className={`relative bg-white rounded-xl p-4 shadow-sm border transition-all hover:shadow-md ${
                isError
                    ? "border-l-4 border-l-red-500 border-slate-200"
                    : "border-l-4 border-l-amber-500 border-slate-200"
            }`}
        >
            {/* Header: Line & Level */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span
                        className={`flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold ${
                            isError
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-600"
                        }`}
                    >
                        {error.line ?? "?"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Line {error.line}
                    </span>
                </div>
                {error.level && (
                    <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                            isError
                                ? "bg-red-50 text-red-600 border-red-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                    >
                        {error.level}
                    </span>
                )}
            </div>

            {/* Error Message */}
            <p className="font-medium text-slate-800 text-sm mb-3">
                {error.message}
            </p>

            {/* Fix Suggestion */}
            {error.fix && (
                <div className="bg-blue-50/50 rounded-lg border border-blue-100 overflow-hidden">
                    <div className="px-3 py-1.5 bg-blue-100/50 border-b border-blue-100 text-[10px] font-bold uppercase text-blue-600 flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3" /> Gợi ý sửa
                    </div>
                    <div className="p-3 text-sm text-blue-900 font-mono bg-white/50">
                        {error.fix}
                    </div>
                </div>
            )}

            {/* Raw Log Toggle (Optional) */}
            {error.raw && (
                <details className="mt-3 group">
                    <summary className="text-[10px] font-medium text-slate-400 cursor-pointer hover:text-slate-600 select-none flex items-center gap-1 w-fit">
                        <span className="group-open:rotate-90 transition-transform">
                            ▶
                        </span>
                        Compiler Output
                    </summary>
                    <pre className="mt-2 text-[10px] text-slate-500 bg-slate-100 p-2 rounded border border-slate-200 overflow-x-auto">
                        {error.raw}
                    </pre>
                </details>
            )}
        </div>
    );
}
