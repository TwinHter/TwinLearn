"use client";

import { useState, useMemo } from "react";
import {
    Puzzle,
    RotateCcw,
    Loader2,
    CheckCircle2,
    XCircle,
    Plus,
    Trash2,
    Search,
    X,
    AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Step, SolverData } from "../../lib/types";
import { ParsedSolverAnalysis } from "../../lib/ai-types";

interface SolverModePracticeProps {
    kbData: SolverData | undefined;
    userPipeline: Step[];
    setUserPipeline: React.Dispatch<React.SetStateAction<Step[]>>;
    aiResult: ParsedSolverAnalysis | undefined;
    isAnalyzing: boolean;
    onValidate: () => void;
    onReset: () => void;
}

export default function SolverModePractice({
    kbData,
    userPipeline,
    setUserPipeline,
    aiResult,
    isAnalyzing,
    onValidate,
    onReset,
}: SolverModePracticeProps) {
    const [stepSearchTerm, setStepSearchTerm] = useState("");

    // Helper xác định trạng thái dựa vào Status (Success, Error, Failed)
    const isSuccess = aiResult?.status === "Success";
    const isError = aiResult?.status === "Error";
    const isFailed = aiResult?.status === "SystemFailed";

    // Filter logic cho danh sách step bên phải
    const filteredSteps = useMemo(() => {
        if (!kbData) return [];
        if (!stepSearchTerm) return kbData.steps;
        const lowerTerm = stepSearchTerm.toLowerCase();
        return kbData.steps.filter(
            (s) =>
                s.label.toLowerCase().startsWith(lowerTerm) ||
                s.id.toLowerCase().includes(lowerTerm),
        );
    }, [kbData, stepSearchTerm]);

    return (
        <div className="flex h-full gap-4">
            {/* --- LEFT: WORKSPACE --- */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="p-5 h-full flex flex-col">
                    {/* TOOLBAR */}
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Puzzle className="w-5 h-5 text-orange-500" /> Quy
                            trình thiết kế của bạn
                        </h3>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onReset}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                <RotateCcw className="w-4 h-4 mr-1" /> Làm lại
                            </Button>
                            <Button
                                size="sm"
                                onClick={onValidate}
                                disabled={
                                    isAnalyzing || userPipeline.length === 0
                                }
                                className={
                                    isSuccess
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : isError
                                          ? "bg-red-600 hover:bg-red-700 text-white"
                                          : isFailed
                                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                                            : "bg-slate-800 text-white"
                                }
                            >
                                {isAnalyzing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : isSuccess ? (
                                    <span className="flex gap-1">
                                        <CheckCircle2 className="w-4 h-4" />{" "}
                                        Chính xác
                                    </span>
                                ) : isError ? (
                                    <span className="flex gap-1">
                                        <XCircle className="w-4 h-4" /> Sai rồi
                                    </span>
                                ) : isFailed ? (
                                    <span className="flex gap-1">
                                        <AlertTriangle className="w-4 h-4" />{" "}
                                        Lỗi Server
                                    </span>
                                ) : (
                                    "Kiểm tra"
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* ALERT BOX */}
                    {aiResult && aiResult.type === 2 && (
                        <div
                            className={`mb-4 p-3 rounded-lg text-sm border flex items-start gap-3 shadow-sm ${
                                isSuccess
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : isError
                                      ? "bg-red-50 border-red-200 text-red-800"
                                      : "bg-amber-50 border-amber-200 text-amber-800"
                            }`}
                        >
                            {isSuccess ? (
                                <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" />
                            ) : isError ? (
                                <XCircle className="w-5 h-5 shrink-0 text-red-600" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                            )}
                            <div>
                                <strong className="block mb-1">
                                    {isSuccess
                                        ? "Tuyệt vời!"
                                        : isError
                                          ? "Quy trình chưa chính xác"
                                          : "Lỗi Hệ thống"}
                                </strong>
                                <span className="opacity-90 leading-relaxed block">
                                    {isSuccess
                                        ? "Bạn đã xây dựng quy trình giải quyết vấn đề hoàn toàn chính xác."
                                        : aiResult?.error ||
                                          "Không có thông tin chi tiết."}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* PIPELINE DROP ZONE */}
                    <div
                        className={`flex-1 rounded-xl border-2 p-4 overflow-auto space-y-2 custom-scrollbar transition-colors ${
                            isSuccess
                                ? "bg-green-50/40 border-green-300 border-solid"
                                : isError
                                  ? "bg-red-50/30 border-red-200 border-dashed"
                                  : "bg-slate-50/50 border-slate-300 border-dashed"
                        }`}
                    >
                        {userPipeline.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <Plus className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-sm">
                                    Chọn các bước từ thư viện bên phải để thêm
                                    vào đây
                                </p>
                            </div>
                        )}

                        {userPipeline.map((step, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 shadow-sm group bg-white hover:border-blue-300 transition-all"
                            >
                                <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-slate-100 text-slate-500">
                                    {idx + 1}
                                </span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-slate-700">
                                        {step.label}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setUserPipeline((prev) =>
                                            prev.filter((_, i) => i !== idx),
                                        );
                                        if (!isSuccess) onReset(); // Reset khi chỉnh sửa
                                    }}
                                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-all opacity-0 group-hover:opacity-100"
                                    title="Xóa bước này"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- RIGHT: STEPS LIBRARY --- */}
            <div className="w-80 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shrink-0 shadow-sm">
                {/* Header & Search */}
                <div className="p-3 border-b border-slate-100 bg-slate-50">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-slate-700">
                            Thư viện Steps
                        </span>
                        <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full text-slate-600 font-mono">
                            {filteredSteps.length}
                        </span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm step..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-200 outline-none focus:border-blue-400 transition-all"
                            value={stepSearchTerm}
                            onChange={(e) => setStepSearchTerm(e.target.value)}
                        />
                        {stepSearchTerm && (
                            <button
                                onClick={() => setStepSearchTerm("")}
                                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* List Steps */}
                <div className="flex-1 overflow-auto p-2 space-y-2 custom-scrollbar bg-slate-50/30">
                    {filteredSteps.length > 0 ? (
                        filteredSteps.map((step) => (
                            <button
                                key={step.id}
                                onClick={() => {
                                    setUserPipeline((prev) => [...prev, step]);
                                    if (aiResult?.status !== "Success")
                                        onReset();
                                }}
                                className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all group active:scale-[0.98]"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="font-semibold text-xs text-slate-700 group-hover:text-blue-700 block mb-1">
                                        {step.label}
                                    </span>
                                    <Plus className="w-3 h-3 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1 rounded inline-block">
                                    {step.id}
                                </span>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-400 text-xs">
                            Không tìm thấy step nào
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
