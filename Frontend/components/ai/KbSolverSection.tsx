"use client";

import { useState } from "react";
import { BookOpen, Puzzle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

import { useSolverData } from "../../hooks/useMetadata";
import { useKbSolver } from "../../hooks/useAiHelper";
import { Step } from "../../lib/types";

import KbSolverHeader from "./KbSolverHeader";
import SolverModeGuide from "./SolverModeGuide";
import SolverModePractice from "./SolverModePractice";

export default function KbSolverSection() {
    const { data: kbData, isLoading: isLoadingMeta } = useSolverData();
    const {
        mutate: callSolver,
        data: aiResult,
        isPending: isAnalyzing,
        reset: resetSolver,
    } = useKbSolver();

    const [selectedProblemId, setSelectedProblemId] = useState<string>("");
    const [selectedInputs, setSelectedInputs] = useState<string[]>([]);
    const [selectedOutputId, setSelectedOutputId] = useState<string>("");
    const [mode, setMode] = useState<"guide" | "practice">("guide");
    const [userPipeline, setUserPipeline] = useState<Step[]>([]);

    const handleProblemChange = (probId: string) => {
        setSelectedProblemId(probId);
        resetSolver();
        setUserPipeline([]);

        if (!kbData || !probId) {
            setSelectedInputs([]);
            setSelectedOutputId("");
            return;
        }

        const problem = kbData.problems.find((p) => p.id === probId);
        if (problem) {
            // Schema mới: problem.inputIds là mảng DataType[] -> Map lấy ID
            setSelectedInputs(problem.inputIds.map((item) => item.id));
            setSelectedOutputId(problem.outputId);
        }
    };

    const handleAddInput = (id: string) => {
        if (!id) return;
        if (!selectedInputs.includes(id)) {
            setSelectedInputs((prev) => [...prev, id]);
        }
        setSelectedProblemId("");
        resetSolver();
    };

    const handleRemoveInput = (idToRemove: string) => {
        setSelectedInputs((prev) => prev.filter((id) => id !== idToRemove));
        setSelectedProblemId("");
        resetSolver();
    };

    const handleOutputChange = (id: string) => {
        setSelectedOutputId(id);
        setSelectedProblemId("");
        resetSolver();
    };

    const handleAutoSolve = () => {
        if (selectedInputs.length === 0 || !selectedOutputId) return;
        callSolver({
            type: 1,
            initial_state: selectedInputs,
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
            <KbSolverHeader
                kbData={kbData}
                selectedProblemId={selectedProblemId}
                selectedInputs={selectedInputs}
                selectedOutputId={selectedOutputId}
                onProblemChange={handleProblemChange}
                onAddInput={handleAddInput}
                onRemoveInput={handleRemoveInput}
                onOutputChange={handleOutputChange}
            />

            {selectedInputs.length > 0 && selectedOutputId ? (
                <div className="flex-1 flex flex-col min-h-0">
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

                    <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        {mode === "guide" ? (
                            <SolverModeGuide
                                selectedProblemId={selectedProblemId}
                                selectedInputs={selectedInputs}
                                selectedOutputId={selectedOutputId}
                                kbData={kbData}
                                aiResult={aiResult}
                                isAnalyzing={isAnalyzing}
                                onAutoSolve={handleAutoSolve}
                            />
                        ) : (
                            <SolverModePractice
                                kbData={kbData}
                                userPipeline={userPipeline}
                                setUserPipeline={setUserPipeline}
                                aiResult={aiResult}
                                isAnalyzing={isAnalyzing}
                                onValidate={handleValidate}
                                onReset={resetSolver}
                            />
                        )}
                    </div>
                </div>
            ) : (
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
