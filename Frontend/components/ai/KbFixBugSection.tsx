"use client";

import { useState } from "react";
import {
    Loader2,
    Bug,
    CheckCircle,
    AlertTriangle,
    FileCode,
} from "lucide-react";
import { Button } from "../ui/button";
import { useKbFixBug } from "../../hooks/useAiHelper"; // Import hook useKbFixBug bạn đã tạo
import type { SyntaxErrorItem } from "../../lib/types";

export default function KbFixBugSection() {
    const [code, setCode] = useState<string>("");
    const { mutate, isPending, data: result } = useKbFixBug();

    const handleAnalyze = () => {
        if (!code.trim()) return;
        mutate({ sourceCode: code });
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Input Area */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <FileCode className="w-4 h-4" /> Source Code (C/C++)
                    </label>
                    <Button
                        onClick={handleAnalyze}
                        disabled={isPending || !code.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                                Đang phân tích...
                            </>
                        ) : (
                            <>
                                <Bug className="w-4 h-4 mr-2" /> Kiểm tra lỗi
                            </>
                        )}
                    </Button>
                </div>

                <textarea
                    className="w-full h-48 p-4 font-mono text-sm border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="#include <iostream>..."
                />
            </div>

            {/* Results Area */}
            {result && (
                <div className="flex-1 overflow-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        Kết quả phân tích:
                        <span
                            className={`text-sm px-3 py-1 rounded-full border ${
                                result.status === "clean"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : result.status === "has_errors"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                        >
                            {result.status === "clean"
                                ? "Code Sạch"
                                : result.status === "Error"
                                ? "Có Lỗi"
                                : result.status}
                        </span>
                    </h3>

                    {/* Case: Clean Code */}
                    {result.status === "clean" && (
                        <div className="p-6 bg-green-50 text-green-800 rounded-xl border border-green-200 flex flex-col items-center justify-center text-center h-40">
                            <CheckCircle className="w-10 h-10 mb-2 text-green-600" />
                            <p className="font-semibold">
                                Tuyệt vời! Không tìm thấy lỗi cú pháp nào.
                            </p>
                        </div>
                    )}

                    {/* Case: Has Errors */}
                    {result.status === "Error" && result.errors && (
                        <div className="grid gap-4">
                            {result.errors.map(
                                (err: SyntaxErrorItem, idx: number) => (
                                    <ErrorCard key={idx} error={err} />
                                )
                            )}
                        </div>
                    )}

                    {/* Case: Parse Error / Raw Log */}
                    {result.status !== "Clean" && (
                        <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 font-mono text-xs text-slate-700 whitespace-pre-wrap overflow-x-auto">
                            <strong>Raw Output:</strong>
                            <br />
                            {result.raw_log || "Không có dữ liệu log."}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Sub-component hiển thị từng lỗi
function ErrorCard({ error }: { error: SyntaxErrorItem }) {
    return (
        <div className="bg-white border-l-4 border-l-red-500 rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-red-600 flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4" /> Dòng {error.line}
                </span>
                <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 border border-slate-200">
                    {error.level}
                </span>
            </div>

            <p className="font-medium text-slate-800 mb-2 text-sm">
                {error.message}
            </p>

            <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                <strong className="block text-xs uppercase text-blue-600 mb-1">
                    Gợi ý sửa:
                </strong>
                {error.fix}
            </div>

            <details className="mt-2 group">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 select-none list-none flex items-center gap-1">
                    <span className="group-open:hidden">▶</span>
                    <span className="hidden group-open:inline">▼</span> Xem chi
                    tiết Compiler
                </summary>
                <pre className="mt-2 text-[10px] text-slate-500 bg-slate-100 p-2 rounded overflow-x-auto border border-slate-200">
                    {error.raw}
                </pre>
            </details>
        </div>
    );
}
