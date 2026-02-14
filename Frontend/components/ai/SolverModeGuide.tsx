"use client";

import {
    Play,
    Loader2,
    CheckCircle2,
    XCircle,
    BookOpen,
    AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/button";
import { ParsedSolverAnalysis } from "../../lib/ai-types";
import { SolverData } from "../../lib/types";

interface SolverModeGuideProps {
    selectedProblemId: string;
    selectedInputs: string[];
    selectedOutputId: string;
    kbData: SolverData | undefined;
    aiResult: ParsedSolverAnalysis | undefined;
    isAnalyzing: boolean;
    onAutoSolve: () => void;
}

export default function SolverModeGuide({
    selectedProblemId,
    selectedInputs,
    selectedOutputId,
    kbData,
    aiResult,
    isAnalyzing,
    onAutoSolve,
}: SolverModeGuideProps) {
    const problemTitle =
        (selectedProblemId &&
            kbData?.problems.find((p) => p.id === selectedProblemId)?.title) ||
        "Bài toán tùy chỉnh";

    // Helper check status
    const isError =
        aiResult?.status === "Error" || aiResult?.status === "SystemFailed";
    const isSuccess = aiResult?.status === "Success";

    return (
        <div className="p-5 h-full flex flex-col">
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                        {problemTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">
                            {selectedInputs.length} Inputs
                        </span>
                        <span>→</span>
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                            {selectedOutputId}
                        </span>
                    </div>
                </div>
                <Button
                    onClick={onAutoSolve}
                    disabled={isAnalyzing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
                >
                    {isAnalyzing ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Play className="w-4 h-4 mr-2" />
                    )}
                    {isAnalyzing
                        ? "Đang suy luận..."
                        : "Giải bằng Knowledge Base"}
                </Button>
            </div>

            {/* --- CONTENT --- */}
            <div className="flex-1 overflow-auto custom-scrollbar pr-2">
                {/* CASE 1: HIỂN THỊ LỖI (Error / SystemFailed) */}
                {isError ? (
                    <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-red-50 p-6 rounded-full mb-4 border border-red-100">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">
                            Không tìm thấy lời giải
                        </h4>
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm max-w-md">
                            <p className="font-semibold mb-1">
                                Chi tiết lỗi từ hệ thống:
                            </p>
                            <p className="opacity-90 leading-relaxed">
                                {aiResult?.error ||
                                    "Đã xảy ra lỗi không xác định."}
                            </p>
                        </div>
                    </div>
                ) : /* CASE 2: HIỂN THỊ CÁC BƯỚC GIẢI (Success) */
                isSuccess && aiResult?.steps && aiResult.steps.length > 0 ? (
                    <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 ml-3">
                        {aiResult.steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="relative pl-6 animate-in fade-in slide-in-from-left-4 duration-500"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Dot connector */}
                                <span className="absolute -left-[29px] top-3 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center z-10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                </span>

                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                                        Bước {idx + 1}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-800">
                                        {step.description}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                                        ID: {step.id}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Success Message at the end */}
                        <div className="relative pl-6 pt-2">
                            <span className="absolute -left-[29px] top-3 w-4 h-4 rounded-full flex items-center justify-center z-10 text-white shadow-sm ring-2 ring-white bg-green-500">
                                <CheckCircle2 className="w-3 h-3" />
                            </span>
                            <div className="text-sm font-bold text-green-600">
                                Hoàn thành!
                            </div>

                            {/* Metadata */}
                            {aiResult.processingTimeMs && (
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Thời gian xử lý:{" "}
                                    {aiResult.processingTimeMs.toFixed(2)}ms
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    /* CASE 3: TRẠNG THÁI CHỜ (Empty State) */
                    <div className="h-full flex flex-col items-center justify-center text-slate-300">
                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                            <BookOpen className="w-10 h-10 opacity-50" />
                        </div>
                        <p className="font-medium text-slate-500">
                            Chưa có lời giải
                        </p>
                        <p className="text-sm">
                            Nhấn nút phía trên để AI tìm kiếm giải thuật
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
