"use client";

import { BookOpen, CheckCircle2, Tag, X } from "lucide-react";
import { Card } from "../ui/card";
import { SolverData } from "../../lib/types";

interface KbSolverHeaderProps {
    kbData: SolverData | undefined;
    selectedProblemId: string;
    selectedInputs: string[];
    selectedOutputId: string;
    onProblemChange: (id: string) => void;
    onAddInput: (id: string) => void;
    onRemoveInput: (id: string) => void;
    onOutputChange: (id: string) => void;
}

export default function KbSolverHeader({
    kbData,
    selectedProblemId,
    selectedInputs,
    selectedOutputId,
    onProblemChange,
    onAddInput,
    onRemoveInput,
    onOutputChange,
}: KbSolverHeaderProps) {
    if (!kbData) return null;

    // Helper: Lấy label input
    const getInputLabel = (id: string) => {
        return kbData.inputTypes.find((i) => i.id === id)?.label || id;
    };

    return (
        <Card className="p-5 bg-white shadow-sm border-slate-200 shrink-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* COL 1: CHỌN BÀI TOÁN */}
                <div className="lg:col-span-3 border-r border-slate-100 pr-4">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> 1. Chọn Bài Toán
                    </label>
                    <select
                        className="w-full p-2.5 text-sm rounded-md border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={selectedProblemId}
                        onChange={(e) => onProblemChange(e.target.value)}
                    >
                        <option value="">-- Tùy chỉnh (Custom) --</option>
                        {kbData.problems.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.title}
                            </option>
                        ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                        Chọn bài toán để tự động điền Input/Output, hoặc tự chọn
                        bên cạnh.
                    </p>
                </div>

                {/* COL 2: INPUT TAGS */}
                <div className="lg:col-span-6 px-2">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> 2. Dữ liệu đầu vào (Initial
                        State)
                    </label>

                    {/* Khu vực hiển thị Tags */}
                    <div className="min-h-[42px] p-1.5 rounded-md border border-slate-200 bg-slate-50 flex flex-wrap gap-2 mb-2 items-center">
                        {selectedInputs.length === 0 && (
                            <span className="text-xs text-slate-400 italic pl-2">
                                Chưa có dữ liệu đầu vào...
                            </span>
                        )}

                        {selectedInputs.map((inputId) => (
                            <span
                                key={inputId}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 shadow-sm animate-in zoom-in duration-200"
                            >
                                {getInputLabel(inputId)}
                                <button
                                    onClick={() => onRemoveInput(inputId)}
                                    className="ml-1.5 p-0.5 rounded-full hover:bg-blue-200 text-blue-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>

                    {/* Dropdown thêm Tag */}
                    <select
                        className="w-full p-2 text-xs rounded border border-slate-200 bg-white text-slate-600 outline-none focus:border-blue-400"
                        value=""
                        onChange={(e) => onAddInput(e.target.value)}
                    >
                        <option value="">+ Thêm dữ liệu đầu vào...</option>
                        {kbData.inputTypes
                            .filter((i) => !selectedInputs.includes(i.id))
                            .map((i) => (
                                <option key={i.id} value={i.id}>
                                    {i.label}
                                </option>
                            ))}
                    </select>
                </div>

                {/* COL 3: OUTPUT */}
                <div className="lg:col-span-3 border-l border-slate-100 pl-4">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 3. Mục tiêu (Goal)
                    </label>
                    <select
                        className="w-full p-2.5 text-sm rounded-md border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        value={selectedOutputId}
                        onChange={(e) => onOutputChange(e.target.value)}
                    >
                        <option value="">-- Chọn Mục tiêu --</option>
                        {kbData.outputTypes.map((o) => (
                            <option key={o.id} value={o.id}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </Card>
    );
}
