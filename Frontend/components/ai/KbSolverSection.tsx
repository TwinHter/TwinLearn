"use client";

import { useState, useEffect, useMemo } from "react";
import {
    BookOpen,
    Puzzle,
    CheckCircle2,
    XCircle,
    Trash2,
    RotateCcw,
    Play,
    Loader2,
    Plus,
    X,
    Search,
    Tag,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input"; // Giả sử bạn có component Input, nếu chưa thì dùng thẻ <input>

import { useSolverData } from "../../hooks/useMetadata";
import { useKbSolver } from "../../hooks/useAiHelper";
import { Step } from "../../lib/kb-data";

export default function KbSolverSection() {
    // 1. Hook Data & API
    const { data: kbData, isLoading: isLoadingMeta } = useSolverData();
    const {
        mutate: callSolver,
        data: aiResult,
        isPending: isAnalyzing,
        reset: resetSolver,
    } = useKbSolver();

    // 2. Local State
    const [selectedProblemId, setSelectedProblemId] = useState<string>("");

    // State quản lý Input dạng mảng chuỗi (Tags)
    const [selectedInputs, setSelectedInputs] = useState<string[]>([]);
    const [selectedOutputId, setSelectedOutputId] = useState<string>("");

    const [mode, setMode] = useState<"guide" | "practice">("guide");
    const [userPipeline, setUserPipeline] = useState<Step[]>([]);

    // State cho Search Steps
    const [stepSearchTerm, setStepSearchTerm] = useState("");

    // --- HELPER LOGIC ---

    // Lấy label của Input từ ID
    const getInputLabel = (id: string) => {
        return kbData?.inputTypes.find((i) => i.id === id)?.label || id;
    };

    // Parse chuỗi "A + B" thành mảng ["A", "B"]
    const parseInputStringToArray = (str: string | string[]): string[] => {
        if (Array.isArray(str)) return str;
        if (!str) return [];
        return str.includes("+") ? str.split("+").map((s) => s.trim()) : [str];
    };

    // --- EVENT HANDLERS ---

    // 1. Xử lý khi chọn Bài Toán
    const handleProblemChange = (probId: string) => {
        setSelectedProblemId(probId);
        resetSolver();
        setUserPipeline([]);

        if (!kbData || !probId) {
            // Nếu chọn "Hủy/Reset", ta giữ nguyên input/output hiện tại hoặc clear tuỳ logic
            // Ở đây tôi chọn clear để clean UI
            setSelectedInputs([]);
            setSelectedOutputId("");
            return;
        }

        const problem = kbData.problems.find((p) => p.id === probId);
        if (problem) {
            // Auto-fill Inputs và Output
            setSelectedInputs(parseInputStringToArray(problem.inputId));
            setSelectedOutputId(problem.outputId);
        }
    };

    // 2. Xử lý thêm Input Tag
    const handleAddInput = (id: string) => {
        if (!id) return;
        if (!selectedInputs.includes(id)) {
            setSelectedInputs((prev) => [...prev, id]);
        }
        // Khi user tự sửa Input, gỡ bỏ bài toán đang chọn
        setSelectedProblemId("");
        resetSolver();
    };

    // 3. Xử lý xóa Input Tag
    const handleRemoveInput = (idToRemove: string) => {
        setSelectedInputs((prev) => prev.filter((id) => id !== idToRemove));
        // Khi user tự sửa Input, gỡ bỏ bài toán đang chọn
        setSelectedProblemId("");
        resetSolver();
    };

    // 4. Xử lý thay đổi Output
    const handleOutputChange = (id: string) => {
        setSelectedOutputId(id);
        setSelectedProblemId(""); // Gỡ bài toán
        resetSolver();
    };

    // 5. Gọi AI
    const handleAutoSolve = () => {
        if (selectedInputs.length === 0 || !selectedOutputId) return;
        callSolver({
            type: 1,
            initial_state: selectedInputs, // Gửi trực tiếp mảng
            goal: selectedOutputId,
            steps: [],
        });
    };

    const handleValidate = () => {
        if (selectedInputs.length === 0 || !selectedOutputId) return;
        callSolver({
            type: 2,
            initial_state: selectedInputs,
            goal: selectedOutputId,
            steps: userPipeline.map((s) => s.id),
        });
    };

    // --- FILTERED STEPS (SEARCH) ---
    const filteredSteps = useMemo(() => {
        if (!kbData) return [];
        if (!stepSearchTerm) return kbData.steps;
        const lowerTerm = stepSearchTerm.toLowerCase();
        // Search theo prefix (startsWith) hoặc includes tuỳ bạn, ở đây dùng startsWith theo yêu cầu
        return kbData.steps.filter(
            (s) =>
                s.label.toLowerCase().startsWith(lowerTerm) ||
                s.id.toLowerCase().includes(lowerTerm)
        );
    }, [kbData, stepSearchTerm]);

    // --- RENDER ---
    if (isLoadingMeta)
        return (
            <div className="p-10 text-center">
                <Loader2 className="animate-spin inline mr-2" />
                Đang tải dữ liệu...
            </div>
        );
    if (!kbData)
        return (
            <div className="text-red-500 p-4">
                Lỗi tải dữ liệu Knowledge Base.
            </div>
        );

    return (
        <div className="flex flex-col gap-6 h-full overflow-hidden">
            {/* --- TOP PANEL: CONFIGURATION --- */}
            <Card className="p-5 bg-white shadow-sm border-slate-200 shrink-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* COL 1: CHỌN BÀI TOÁN (Chiếm 3/12) */}
                    <div className="lg:col-span-3 border-r border-slate-100 pr-4">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> 1. Chọn Bài Toán
                        </label>
                        <select
                            className="w-full p-2.5 text-sm rounded-md border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={selectedProblemId}
                            onChange={(e) =>
                                handleProblemChange(e.target.value)
                            }
                        >
                            <option value="">-- Tùy chỉnh (Custom) --</option>
                            {kbData.problems.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                        <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                            Chọn bài toán để tự động điền Input/Output, hoặc tự
                            chọn bên cạnh.
                        </p>
                    </div>

                    {/* COL 2: INPUT TAGS (Chiếm 6/12) */}
                    <div className="lg:col-span-6 px-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                            <Tag className="w-3 h-3" /> 2. Dữ liệu đầu vào
                            (Initial State)
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
                                        onClick={() =>
                                            handleRemoveInput(inputId)
                                        }
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
                            onChange={(e) => handleAddInput(e.target.value)}
                        >
                            <option value="">+ Thêm dữ liệu đầu vào...</option>
                            {kbData.inputTypes
                                .filter((i) => !selectedInputs.includes(i.id)) // Ẩn những cái đã chọn
                                .map((i) => (
                                    <option key={i.id} value={i.id}>
                                        {i.label}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* COL 3: OUTPUT (Chiếm 3/12) */}
                    <div className="lg:col-span-3 border-l border-slate-100 pl-4">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> 3. Mục tiêu
                            (Goal)
                        </label>
                        <select
                            className="w-full p-2.5 text-sm rounded-md border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                            value={selectedOutputId}
                            onChange={(e) => handleOutputChange(e.target.value)}
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

            {/* --- MAIN WORKSPACE --- */}
            {selectedInputs.length > 0 && selectedOutputId ? (
                <div className="flex-1 flex flex-col min-h-0">
                    {/* TABS MODE */}
                    <div className="flex gap-2 mb-3">
                        <Button
                            variant={mode === "guide" ? "default" : "outline"}
                            onClick={() => {
                                setMode("guide");
                                resetSolver();
                            }}
                            className="h-9 text-sm"
                        >
                            <BookOpen className="w-4 h-4 mr-2" /> Hướng dẫn
                        </Button>
                        <Button
                            variant={
                                mode === "practice" ? "default" : "outline"
                            }
                            onClick={() => {
                                setMode("practice");
                                resetSolver();
                            }}
                            className="h-9 text-sm"
                        >
                            <Puzzle className="w-4 h-4 mr-2" /> Tự luyện
                        </Button>
                    </div>

                    <div className="flex-1 flex gap-4 min-h-0">
                        {/* --- LEFT: DISPLAY RESULT / USER PIPELINE --- */}
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
                            {/* === MODE 1: GUIDE === */}
                            {mode === "guide" && (
                                <div className="p-5 h-full flex flex-col">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">
                                                {(selectedProblemId &&
                                                    kbData.problems.find(
                                                        (p) =>
                                                            p.id ===
                                                            selectedProblemId
                                                    )?.title) ||
                                                    "Bài toán tùy chỉnh"}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">
                                                    {selectedInputs.length}{" "}
                                                    Inputs
                                                </span>
                                                <span>→</span>
                                                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-mono font-bold">
                                                    {selectedOutputId}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleAutoSolve}
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

                                    <div className="flex-1 overflow-auto custom-scrollbar pr-2">
                                        {aiResult?.steps ? (
                                            <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 ml-3">
                                                {aiResult.steps.map(
                                                    (step, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="relative pl-6 animate-in fade-in slide-in-from-left-4 duration-500"
                                                            style={{
                                                                animationDelay: `${
                                                                    idx * 100
                                                                }ms`,
                                                            }}
                                                        >
                                                            {/* Dot connector */}
                                                            <span className="absolute -left-[29px] top-3 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center z-10">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                                            </span>

                                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                                                                <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                                                                    Bước{" "}
                                                                    {idx + 1}
                                                                </div>
                                                                <div className="text-sm font-semibold text-slate-800">
                                                                    {
                                                                        step.description
                                                                    }
                                                                </div>
                                                                <div className="text-[10px] text-slate-400 font-mono mt-1">
                                                                    ID:{" "}
                                                                    {step.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                                <div className="relative pl-6 pt-2">
                                                    {(() => {
                                                        // Kiểm tra status từ API (success hoặc true đều được coi là thành công)
                                                        const isSuccess =
                                                            aiResult.status ===
                                                                "success" ||
                                                            aiResult.status ===
                                                                "true";

                                                        return (
                                                            <>
                                                                {/* Icon tròn hiển thị trạng thái */}
                                                                <span
                                                                    className={`absolute -left-[29px] top-3 w-4 h-4 rounded-full flex items-center justify-center z-10 text-white shadow-sm ring-2 ring-white ${
                                                                        isSuccess
                                                                            ? "bg-green-500"
                                                                            : "bg-red-500"
                                                                    }`}
                                                                >
                                                                    {isSuccess ? (
                                                                        <CheckCircle2 className="w-3 h-3" />
                                                                    ) : (
                                                                        <XCircle className="w-3 h-3" />
                                                                    )}
                                                                </span>

                                                                {/* Nội dung text thông báo */}
                                                                <div>
                                                                    <div
                                                                        className={`text-sm font-bold ${
                                                                            isSuccess
                                                                                ? "text-green-600"
                                                                                : "text-red-600"
                                                                        }`}
                                                                    >
                                                                        {isSuccess
                                                                            ? "Hoàn thành!"
                                                                            : "Không tìm thấy lời giải"}
                                                                    </div>

                                                                    {/* Nếu thất bại, hiện lời khuyên */}
                                                                    {!isSuccess && (
                                                                        <div className="mt-2 text-xs bg-red-50 border border-red-100 text-red-600 p-2 rounded-md inline-block">
                                                                            <p className="font-semibold mb-1">
                                                                                Không
                                                                                thể
                                                                                suy
                                                                                diễn
                                                                                từ
                                                                                Input
                                                                                đến
                                                                                Goal.
                                                                            </p>
                                                                            <p className="opacity-90">
                                                                                Vui
                                                                                lòng
                                                                                kiểm
                                                                                tra
                                                                                lại:{" "}
                                                                                <br />
                                                                                1.{" "}
                                                                                <b>
                                                                                    Input
                                                                                </b>{" "}
                                                                                đã
                                                                                đủ
                                                                                dữ
                                                                                kiện
                                                                                chưa?
                                                                                <br />
                                                                                2.{" "}
                                                                                <b>
                                                                                    Goal
                                                                                </b>{" "}
                                                                                có
                                                                                khả
                                                                                thi
                                                                                với
                                                                                Input
                                                                                này
                                                                                không?
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                                <div className="bg-slate-50 p-6 rounded-full mb-4">
                                                    <BookOpen className="w-10 h-10 opacity-50" />
                                                </div>
                                                <p className="font-medium text-slate-500">
                                                    Chưa có lời giải
                                                </p>
                                                <p className="text-sm">
                                                    Nhấn nút phía trên để AI tìm
                                                    kiếm giải thuật
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* === MODE 2: PRACTICE === */}
                            {mode === "practice" && (
                                <div className="p-5 h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Puzzle className="w-5 h-5 text-orange-500" />{" "}
                                            Quy trình thiết kế của bạn
                                        </h3>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    setUserPipeline([]);
                                                    resetSolver();
                                                }}
                                                className="text-slate-500 hover:text-slate-700"
                                            >
                                                <RotateCcw className="w-4 h-4 mr-1" />{" "}
                                                Làm lại
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleValidate}
                                                disabled={
                                                    isAnalyzing ||
                                                    userPipeline.length === 0
                                                }
                                                className={
                                                    aiResult?.status === "true"
                                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                                        : aiResult?.status
                                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                                        : "bg-slate-800 text-white"
                                                }
                                            >
                                                {isAnalyzing ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : aiResult?.status ===
                                                  "true" ? (
                                                    <span className="flex gap-1">
                                                        <CheckCircle2 className="w-4 h-4" />{" "}
                                                        Chính xác
                                                    </span>
                                                ) : aiResult?.status ? (
                                                    <span className="flex gap-1">
                                                        <XCircle className="w-4 h-4" />{" "}
                                                        Sai rồi
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
                                            className={`mb-4 p-3 rounded-lg text-sm border flex items-start gap-3 ${
                                                aiResult.status === "true"
                                                    ? "bg-green-50 border-green-200 text-green-800"
                                                    : "bg-red-50 border-red-200 text-red-800"
                                            }`}
                                        >
                                            {aiResult.status === "true" ? (
                                                <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 shrink-0 text-red-600" />
                                            )}
                                            <div>
                                                <strong className="block mb-1">
                                                    {aiResult.status === "true"
                                                        ? "Tuyệt vời!"
                                                        : "Chưa chính xác"}
                                                </strong>
                                                <span className="opacity-90">
                                                    {aiResult.status === "true"
                                                        ? "Bạn đã xây dựng quy trình giải quyết vấn đề chính xác."
                                                        : aiResult.detail}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* PIPELINE DROP ZONE */}
                                    <div
                                        className={`flex-1 rounded-xl border-2 border-dashed p-4 overflow-auto space-y-2 custom-scrollbar transition-colors ${
                                            aiResult?.status === "true"
                                                ? "bg-green-50/40 border-green-300"
                                                : "bg-slate-50/50 border-slate-300"
                                        }`}
                                    >
                                        {userPipeline.length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                                <Plus className="w-8 h-8 mb-2 opacity-20" />
                                                <p className="text-sm">
                                                    Chọn các bước từ thư viện
                                                    bên phải để thêm vào đây
                                                </p>
                                            </div>
                                        )}

                                        {userPipeline.map((step, idx) => {
                                            const isError =
                                                aiResult?.error_step_index ===
                                                idx;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border shadow-sm group bg-white hover:border-blue-300 transition-all ${
                                                        isError
                                                            ? "border-red-400 bg-red-50"
                                                            : "border-slate-200"
                                                    }`}
                                                >
                                                    <span
                                                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                                            isError
                                                                ? "bg-red-200 text-red-700"
                                                                : "bg-slate-100 text-slate-500"
                                                        }`}
                                                    >
                                                        {idx + 1}
                                                    </span>
                                                    <div className="flex-1">
                                                        <div
                                                            className={`text-sm font-medium ${
                                                                isError
                                                                    ? "text-red-700"
                                                                    : "text-slate-700"
                                                            }`}
                                                        >
                                                            {step.label}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            setUserPipeline(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) =>
                                                                            i !==
                                                                            idx
                                                                    )
                                                            )
                                                        }
                                                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-all opacity-0 group-hover:opacity-100"
                                                        title="Xóa bước này"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* --- RIGHT: STEPS LIBRARY (Only visible in Practice Mode) --- */}
                        {mode === "practice" && (
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
                                            onChange={(e) =>
                                                setStepSearchTerm(
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {stepSearchTerm && (
                                            <button
                                                onClick={() =>
                                                    setStepSearchTerm("")
                                                }
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
                                                    setUserPipeline((prev) => [
                                                        ...prev,
                                                        step,
                                                    ]);
                                                    if (
                                                        aiResult?.status !==
                                                        "true"
                                                    )
                                                        resetSolver();
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
                        )}
                    </div>
                </div>
            ) : (
                // EMPTY STATE
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30 m-4 animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Puzzle className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-600 mb-1">
                        Bắt đầu khám phá
                    </h3>
                    <p className="text-sm max-w-md text-center">
                        Vui lòng chọn <strong>Bài toán mẫu</strong> ở trên, hoặc
                        tự chọn <strong>Dữ liệu đầu vào</strong> và{" "}
                        <strong>Mục tiêu</strong> để hệ thống Knowledge Base hỗ
                        trợ bạn.
                    </p>
                </div>
            )}
        </div>
    );
}
