"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import type { Problem } from "../lib/types";
import { useProblems } from "../hooks/useProblems";
import { useAddChecklistItem } from "../hooks/useChecklist";

interface AddChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddChecklistModal({
    isOpen,
    onClose,
}: AddChecklistModalProps) {
    const [mode, setMode] = useState<"raw" | "problem">("raw");
    const [rawText, setRawText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { data: problems } = useProblems();

    const filteredProblems = (problems || []).filter((p: Problem) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const addChecklist = useAddChecklistItem();

    const handleAddRaw = () => {
        if (rawText.trim()) {
            addChecklist.mutate({
                description: rawText.trim(),
            });
            setRawText("");
            setMode("raw");
            onClose();
        }
    };

    const handleAddProblem = (problem: Problem) => {
        addChecklist.mutate({
            problemId: problem.id,
        });
        setSearchQuery("");
        setMode("raw");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <Card
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl 
                shadow-2xl border border-border/50 bg-gradient-to-br from-background to-secondary/30 
                dark:from-[#111] dark:to-[#1b1b1b] transition-colors"
            >
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-lg font-semibold text-foreground tracking-tight">
                        Thêm nhiệm vụ mới
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Mode Selection */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setMode("raw")}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${
                                mode === "raw"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                        >
                            ✍️ Thêm văn bản
                        </button>
                        <button
                            onClick={() => setMode("problem")}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${
                                mode === "problem"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-muted text-foreground hover:bg-muted/80"
                            }`}
                        >
                            📚 Chọn từ Bài toán
                        </button>
                    </div>

                    {/* Raw Text Mode */}
                    {mode === "raw" && (
                        <div className="space-y-5 animate-fade-in">
                            <textarea
                                placeholder="Nhập nhiệm vụ của bạn..."
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                                className="w-full h-32 p-4 rounded-lg border border-border 
                                bg-background/90 dark:bg-[#181818] 
                                text-foreground placeholder:text-muted-foreground 
                                focus:ring-2 focus:ring-blue-500 focus:outline-none 
                                resize-none transition-all"
                            />
                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="rounded-lg hover:bg-muted/60"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleAddRaw}
                                    className="rounded-lg bg-blue-600 hover:bg-blue-700 gap-2 shadow-sm"
                                    disabled={!rawText.trim()}
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Problem Selection Mode */}
                    {mode === "problem" && (
                        <div className="space-y-4 animate-fade-in">
                            <Input
                                placeholder="🔍 Tìm kiếm bài toán..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-background/90 dark:bg-[#181818] border border-border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/40">
                                {filteredProblems.length > 0 ? (
                                    filteredProblems.map((problem: Problem) => (
                                        <button
                                            key={problem.id}
                                            onClick={() =>
                                                handleAddProblem(problem)
                                            }
                                            className="w-full text-left p-4 border border-border rounded-lg 
                                            hover:border-blue-500 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 
                                            transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-foreground text-sm">
                                                    {problem.title}
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700"
                                                >
                                                    {problem.difficulty}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {problem.description}
                                            </p>
                                        </button>
                                    ))
                                ) : (
                                    <div className="py-10 text-center text-muted-foreground text-sm">
                                        Không tìm thấy bài toán nào 😢
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
