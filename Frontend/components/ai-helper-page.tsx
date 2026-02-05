"use client";

import { useState } from "react";
import { ChevronDown, Bot, GraduationCap, Puzzle } from "lucide-react";
import { Button } from "./ui/button";
import LlmChatSection from "./ai/LlmChatSection";
import KbFixBugSection from "./ai/KbFixBugSection";
import KbSolverSection from "./ai/KbSolverSection"; // Import mới

export default function AiHelperPage() {
    // Thêm mode 'kb_solver' vào state
    const [mode, setMode] = useState<"llm" | "kb_fix_bug" | "kb_solver">("llm");
    const [showModeFilter, setShowModeFilter] = useState(false);

    // Hàm helper để hiển thị text tiêu đề
    const getModeTitle = () => {
        if (mode === "llm") return "Hỏi Chatbot (LLM)";
        if (mode === "kb_fix_bug") return "Fix Bug (Knowledge Base)";
        if (mode === "kb_solver") return "Học Giải Thuật (KB)";
    };

    const getModeDesc = () => {
        if (mode === "llm")
            return "Trợ lý ảo hỗ trợ giải đáp mọi thắc mắc về lập trình";
        if (mode === "kb_fix_bug")
            return "Hệ thống chuyên gia phát hiện và sửa lỗi code C++";
        if (mode === "kb_solver")
            return "Hệ thống bài tập và hướng dẫn xây dựng lưu đồ giải thuật";
    };

    const getModeIcon = () => {
        if (mode === "llm") return <Bot className="w-4 h-4 text-blue-600" />;
        if (mode === "kb_fix_bug")
            return <GraduationCap className="w-4 h-4 text-indigo-600" />;
        if (mode === "kb_solver")
            return <Puzzle className="w-4 h-4 text-amber-600" />;
    };

    return (
        <div className="p-6 h-screen flex flex-col max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-1">
                    AI Assistant
                </h2>
                <p className="text-slate-500 text-sm">{getModeDesc()}</p>
            </div>

            {/* Mode Switcher */}
            <div className="mb-6 relative w-72 mx-auto z-50">
                <Button
                    onClick={() => setShowModeFilter(!showModeFilter)}
                    variant="outline"
                    className="w-full justify-between bg-white hover:bg-slate-50 border-slate-300 rounded-xl shadow-sm h-11"
                >
                    <span className="text-slate-700 flex items-center gap-2">
                        {getModeIcon()}
                        {getModeTitle()}
                    </span>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform ${
                            showModeFilter ? "rotate-180" : ""
                        }`}
                    />
                </Button>

                {showModeFilter && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        {/* Option 1: LLM */}
                        <button
                            onClick={() => {
                                setMode("llm");
                                setShowModeFilter(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                                mode === "llm" ? "bg-blue-50/50" : ""
                            }`}
                        >
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    Hỏi Chatbot
                                </p>
                                <p className="text-xs text-slate-500">
                                    Trò chuyện tự do
                                </p>
                            </div>
                        </button>
                        <div className="h-px bg-slate-100 mx-4"></div>

                        {/* Option 2: Fix Bug */}
                        <button
                            onClick={() => {
                                setMode("kb_fix_bug");
                                setShowModeFilter(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                                mode === "kb_fix_bug" ? "bg-indigo-50/50" : ""
                            }`}
                        >
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    Fix Bug Code
                                </p>
                                <p className="text-xs text-slate-500">
                                    Phân tích lỗi cú pháp C++
                                </p>
                            </div>
                        </button>
                        <div className="h-px bg-slate-100 mx-4"></div>

                        {/* Option 3: Solver (Mới) */}
                        <button
                            onClick={() => {
                                setMode("kb_solver");
                                setShowModeFilter(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                                mode === "kb_solver" ? "bg-amber-50/50" : ""
                            }`}
                        >
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                <Puzzle className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    Học Giải Thuật
                                </p>
                                <p className="text-xs text-slate-500">
                                    Bài tập Input/Output & Pipeline
                                </p>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 relative">
                {mode === "llm" && <LlmChatSection key="llm" />}
                {mode === "kb_fix_bug" && <KbFixBugSection key="kb_fix_bug" />}
                {mode === "kb_solver" && <KbSolverSection key="kb_solver" />}
            </div>
        </div>
    );
}
