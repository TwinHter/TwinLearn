"use client";
import { createPortal } from "react-dom";

import { X, Trash2, Copy, Check, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useState } from "react";
import type { SearchHistory } from "../lib/types";

interface SearchHistoryModalProps {
    onClose: () => void;
    history: SearchHistory[];
    onDeleteHistory: (id: number) => void;
}

export default function SearchHistoryModal({
    onClose,
    history,
    onDeleteHistory,
}: SearchHistoryModalProps) {
    const [copied, setCopied] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<SearchHistory | null>(
        null
    );

    const deleteItem = (id: number) => {
        onDeleteHistory(id);
    };

    const copyResponse = (id: number, response: string) => {
        navigator.clipboard.writeText(response);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatDate = (date: string) => {
        const now = new Date();
        const inputDate = new Date(date);
        const diffMs = now.getTime() - inputDate.getTime();

        if (diffMs < 60000) {
            if (diffMs < 1000) return "Vừa xong";
            if (diffMs < 60000)
                return `${Math.floor(diffMs / 1000)} giây trước`;

            return inputDate.toLocaleDateString("vi-VN");
        }

        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins} phút trước`;

        const diffHours = Math.floor(diffMs / 3600000);
        if (diffHours < 24) return `${diffHours} giờ trước`;

        const diffDays = Math.floor(diffMs / 86400000);
        if (diffDays < 7) return `${diffDays} ngày trước`;

        return inputDate.toLocaleDateString("vi-VN");
    };

    // --- Detail View ---
    if (selectedItem) {
        return createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl shadow-xl border border-slate-200 bg-white/95 overflow-auto">
                    <div className="flex justify-between items-center p-5 border-b border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-800">
                            Chi tiết hỏi AI
                        </h2>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto px-6 py-4 space-y-6 text-slate-800">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 mb-2">
                                Câu hỏi
                            </h3>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {selectedItem.userInput}
                            </p>
                        </div>

                        <div className="border-t border-slate-200 pt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-sm font-semibold text-slate-500">
                                    Phản hồi
                                </h3>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        selectedItem.engineUsed === "Gemini"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-purple-100 text-purple-700"
                                    }`}
                                >
                                    {selectedItem.engineUsed}
                                </span>
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {selectedItem.engineResponse}
                            </p>
                        </div>

                        <div className="border-t border-slate-200 pt-3">
                            <p className="text-xs text-slate-500">
                                {formatDate(selectedItem.searchDate)}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 p-5 border-t border-slate-200 bg-slate-50/80">
                        <Button
                            onClick={() =>
                                copyResponse(
                                    selectedItem.id,
                                    selectedItem.engineResponse
                                )
                            }
                            variant="outline"
                            className="gap-2 border-slate-300 bg-white hover:bg-slate-100 rounded-xl"
                        >
                            {copied === selectedItem.id ? (
                                <>
                                    <Check className="w-4 h-4 text-green-600" />
                                    Đã sao chép
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 text-slate-700" />
                                    Sao chép
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="ml-auto border-slate-300 bg-white hover:bg-slate-100 rounded-xl"
                            onClick={() => setSelectedItem(null)}
                        >
                            Đóng
                        </Button>
                    </div>
                </Card>
            </div>,
            document.body
        );
    }

    // --- History List ---
    return createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-all">
            <Card className="w-full max-w-3xl max-h-[85vh] flex flex-col m-4 rounded-2xl shadow-xl border border-slate-200 bg-white/95">
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800">
                        Lịch sử hỏi AI
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-5 space-y-3">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
                            <p className="text-base font-medium">
                                Chưa có lịch sử hỏi nào
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                                Hỏi AI để xem lịch sử xuất hiện ở đây
                            </p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <Card
                                key={item.id}
                                className="p-4 border border-slate-200 hover:border-blue-400 bg-white/90 hover:bg-blue-50/50 transition-all rounded-xl group cursor-pointer shadow-sm"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-slate-800 flex-1">
                                                {item.userInput}
                                            </h3>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.engineUsed === "Gemini"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-purple-100 text-purple-700"
                                                }`}
                                            >
                                                {item.engineUsed}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            {item.engineResponse}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {formatDate(item.searchDate)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyResponse(
                                                    item.id,
                                                    item.engineResponse
                                                );
                                            }}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            {copied === item.id ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-slate-500" />
                                            )}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteItem(item.id);
                                            }}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                <div className="flex gap-3 p-5 border-t border-slate-200 bg-slate-50/80">
                    <Button
                        variant="outline"
                        className="ml-auto border-slate-300 bg-white hover:bg-slate-100 rounded-xl"
                        onClick={onClose}
                    >
                        Đóng
                    </Button>
                </div>
            </Card>
        </div>,
        document.body
    );
}
