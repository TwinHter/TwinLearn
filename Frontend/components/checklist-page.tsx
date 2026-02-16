"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import AddChecklistModal from "./add-checklist-modal";
import ProblemDetailModal from "./problem-detail-modal";
import type { ChecklistItem, Problem } from "../lib/types";
import {
    useChecklist,
    useUpdateChecklistItem,
    useDeleteChecklistItem,
} from "../hooks/useChecklist";

export default function ChecklistPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterMode, setFilterMode] = useState<
        "all" | "completed" | "incomplete"
    >("all");
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(
        null,
    );
    const updateChecklistItem = useUpdateChecklistItem();
    const deleteChecklistItem = useDeleteChecklistItem();

    const { data: checklistData, isLoading } = useChecklist();
    if (isLoading) return <div>Loading...</div>;

    const filteredItems = checklistData?.filter((item) => {
        if (filterMode === "completed") return item.status === "Completed";
        if (filterMode === "incomplete") return item.status !== "Completed";
        return true;
    });

    const completedCount =
        checklistData?.filter((item) => item.status === "Completed").length ||
        0;
    const completionPercent = checklistData
        ? Math.round((completedCount / checklistData.length) * 100)
        : 0;

    const toggleItem = (item: ChecklistItem) => {
        updateChecklistItem.mutate({
            id: item.id,
            status: item.status === "Completed" ? "NotCompleted" : "Completed",
        });
    };

    const deleteItem = (id: number) => {
        deleteChecklistItem.mutate(id);
    };

    const handleItemClick = (item: ChecklistItem) => {
        if (item.problem) setSelectedProblem(item.problem);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-white text-foreground">
            {/* Main Content Area */}
            <div className="flex-1 p-10 overflow-y-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold mb-2 text-blue-700">
                        My Checklist
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Quản lý danh sách công việc luyện tập lập trình
                    </p>
                </div>

                <Card className="p-6 shadow-lg border border-border/60 bg-white/80 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-xl">
                    {/* Filter Buttons */}
                    <div className="flex gap-3 mb-8">
                        {[
                            { mode: "all", label: "Tất cả" },
                            { mode: "incomplete", label: "Chưa làm" },
                            { mode: "completed", label: "Đã làm" },
                        ].map((f) => (
                            <button
                                key={f.mode}
                                onClick={() => setFilterMode(f.mode as any)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                                    filterMode === f.mode
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                        : "bg-white text-foreground border-border hover:bg-blue-50 hover:border-blue-400"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-1 mb-8">
                        {filteredItems && filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                                <div key={item.id}>
                                    <div
                                        className={`flex items-start gap-4 p-4 rounded-xl transition-all group ${
                                            item.problemId
                                                ? "cursor-pointer hover:bg-blue-50"
                                                : "hover:bg-secondary/40"
                                        }`}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleItem(item);
                                            }}
                                            className="text-muted-foreground hover:text-blue-600 transition-colors shrink-0 mt-1"
                                        >
                                            {item.status === "Completed" ? (
                                                <CheckCircle2 className="w-6 h-6 text-blue-600 drop-shadow-sm" />
                                            ) : (
                                                <Circle className="w-6 h-6" />
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span
                                                    className={`text-sm ${
                                                        item.status ===
                                                        "Completed"
                                                            ? "text-muted-foreground line-through"
                                                            : "text-foreground font-medium"
                                                    }`}
                                                >
                                                    {item.problem
                                                        ? item.problem.title
                                                        : item.description}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs rounded-full px-2 py-0.5 ${
                                                        item.problemId
                                                            ? "bg-blue-100 text-blue-700 border-blue-200"
                                                            : "bg-gray-100 text-gray-600 border-gray-300"
                                                    }`}
                                                >
                                                    {item.problemId
                                                        ? "Bài toán"
                                                        : "Raw"}
                                                </Badge>
                                            </div>
                                            {/* <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                {item.description ||
                                                    item.problem?.description}
                                            </p> */}
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteItem(item.id);
                                            }}
                                            className="text-muted-foreground hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {index < filteredItems.length - 1 && (
                                        <div className="h-px bg-border mx-4 opacity-50" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-muted-foreground italic">
                                {filterMode === "all"
                                    ? "Chưa có nhiệm vụ nào. Hãy thêm một cái!"
                                    : filterMode === "completed"
                                      ? "Chưa hoàn thành nhiệm vụ nào."
                                      : "Không có nhiệm vụ chưa làm."}
                            </div>
                        )}
                    </div>

                    {/* Add Button */}
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 gap-2 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm nhiệm vụ mới
                    </Button>
                </Card>
            </div>

            {/* Sidebar Progress */}
            <div className="w-36 border-l border-border bg-gradient-to-b from-white to-slate-100 flex flex-col items-center justify-center p-4">
                <div className="flex flex-col items-center gap-3 h-full justify-center">
                    <span className="text-sm font-semibold text-blue-700">
                        {completionPercent}%
                    </span>
                    <div className="w-3 h-48 bg-slate-200 rounded-full overflow-hidden shadow-inner relative">
                        <div
                            className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-500 rounded-full"
                            style={{
                                height: `${completionPercent}%`,
                            }}
                        />
                    </div>
                    <span className="text-xs text-muted-foreground text-center font-medium">
                        {completedCount}/{checklistData?.length ?? 0}
                    </span>
                </div>
            </div>

            {/* Modals */}
            <AddChecklistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            {selectedProblem && (
                <ProblemDetailModal
                    problem={selectedProblem}
                    onClose={() => setSelectedProblem(null)}
                />
            )}
        </div>
    );
}
