"use client";

import { useState } from "react";
import { X, Plus, CheckCircle2, Circle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
    useChecklist,
    useUpdateChecklistItem,
    useAddChecklistItem,
} from "../hooks/useChecklist";
import { ChecklistItem } from "../lib/types";

interface ChecklistPanelProps {
    onClose: () => void;
}

export default function ChecklistPanel({ onClose }: ChecklistPanelProps) {
    const { data: checkListItems, isLoading } = useChecklist();
    const { mutate: updateItem } = useUpdateChecklistItem();
    const { mutate: addItem } = useAddChecklistItem();
    const [newItem, setNewItem] = useState<ChecklistItem | null>(null);

    if (isLoading) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                Loading...
            </div>
        );
    }

    const toggleItem = (item: ChecklistItem) => {
        const newStatus =
            item.status === "Completed" ? "NotCompleted" : "Completed";
        updateItem({
            id: item.id,
            status: newStatus,
        });
    };

    const handleAddItem = () => {
        if (!newItem) return;
        addItem(newItem);
        setNewItem(null);
    };

    const completedCount = checkListItems?.filter(
        (item) => item.status === "Completed"
    ).length;
    const completionPercent = checkListItems
        ? Math.round((completedCount! / checkListItems.length) * 100)
        : 0;

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-white text-foreground shadow-inner rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-border bg-white/60 backdrop-blur-sm">
                <h3 className="font-semibold text-base">Your Checklist</h3>
                <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-destructive/10"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Progress */}
            <div className="p-4 border-b border-border bg-white/40 backdrop-blur-sm">
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{completionPercent}%</span>
                </div>
                <div className="w-full h-2 bg-secondary/40 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-in-out"
                        style={{ width: `${completionPercent}%` }}
                    />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                    {completedCount} of {checkListItems?.length} completed
                </div>
            </div>

            {/* Checklist items */}
            <div className="flex-1 overflow-auto p-4 space-y-2 bg-white/30 backdrop-blur-sm">
                {checkListItems?.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-lg transition-colors group cursor-pointer hover:bg-blue-50 hover:shadow-sm"
                    >
                        <button
                            onClick={() => toggleItem(item)}
                            className="text-muted-foreground hover:text-blue-600 transition-colors shrink-0"
                        >
                            {item.status === "Completed" ? (
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            ) : (
                                <Circle className="w-5 h-5" />
                            )}
                        </button>
                        <span
                            className={`text-sm flex-1 transition-colors ${
                                item.status === "Completed"
                                    ? "text-muted-foreground line-through"
                                    : "text-foreground"
                            }`}
                        >
                            {item.description || item.problem.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-white/60 backdrop-blur-sm">
                <div className="flex gap-2">
                    <Input
                        placeholder="Add new task..."
                        value={newItem as any}
                        onChange={(e) => setNewItem(e.target.value as any)}
                        className="text-sm bg-white/80 focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                    <Button
                        onClick={handleAddItem}
                        size="sm"
                        className="px-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
