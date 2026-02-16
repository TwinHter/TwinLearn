"use client";
import { createPortal } from "react-dom";

import {
    X,
    Trash2,
    Copy,
    Check,
    ChevronRight,
    Search,
    Clock,
} from "lucide-react";
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
        null,
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
            return `${Math.floor(diffMs / 1000)} giây trước`;
        }

        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins} phút trước`;

        const diffHours = Math.floor(diffMs / 3600000);
        if (diffHours < 24) return `${diffHours} giờ trước`;

        const diffDays = Math.floor(diffMs / 86400000);
        if (diffDays < 7) return `${diffDays} ngày trước`;

        return inputDate.toLocaleDateString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Hàm giới hạn ký tự an toàn
    const truncateText = (text: string, maxLength: number) => {
        if (!text) return "";
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    // --- Detail View (Modal nhỏ bên trong) ---
    if (selectedItem) {
        return createPortal(
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border-0 bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <Search className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                Chi tiết hỏi AI
                            </h2>
                        </div>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Section Câu hỏi */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                                Your Question
                            </h3>
                            <p className="whitespace-pre-wrap leading-relaxed text-slate-800 font-medium">
                                {selectedItem.userInput}
                            </p>
                        </div>

                        {/* Section Trả lời */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    AI Response
                                </h3>
                                <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                                        selectedItem.engineUsed === "Gemini"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-purple-100 text-purple-700"
                                    }`}
                                >
                                    {selectedItem.engineUsed}
                                </span>
                            </div>
                            <div className="prose prose-sm max-w-none prose-slate">
                                <p className="whitespace-pre-wrap leading-relaxed text-slate-600 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                                    {selectedItem.engineResponse}
                                </p>
                            </div>
                        </div>

                        {/* Thời gian */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2">
                            <Clock className="w-3.5 h-3.5" />
                            Đã hỏi lúc {formatDate(selectedItem.searchDate)}
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50">
                        <Button
                            onClick={() =>
                                copyResponse(
                                    selectedItem.id,
                                    selectedItem.engineResponse,
                                )
                            }
                            variant="outline"
                            className={`gap-2 rounded-xl transition-all ${
                                copied === selectedItem.id
                                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            {copied === selectedItem.id ? (
                                <>
                                    <Check className="w-4 h-4" /> Đã sao chép
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" /> Sao chép phản
                                    hồi
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            className="rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                            onClick={() => setSelectedItem(null)}
                        >
                            Đóng chi tiết
                        </Button>
                    </div>
                </Card>
            </div>,
            document.body,
        );
    }

    // --- History List (Modal chính) ---
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all">
            <Card className="w-full max-w-3xl h-[85vh] flex flex-col rounded-2xl shadow-2xl border-0 bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            AI Search History
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Xem lại các câu hỏi và câu trả lời trước đây
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* List Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-3">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-base font-medium text-slate-700">
                                Chưa có lịch sử hỏi nào
                            </p>
                            <p className="text-sm text-slate-400 max-w-xs">
                                Các câu hỏi của bạn với AI sẽ được lưu trữ và
                                hiển thị tại đây.
                            </p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <Card
                                key={item.id}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/30 hover:shadow-md transition-all rounded-xl cursor-pointer gap-4 overflow-hidden"
                                onClick={() => setSelectedItem(item)}
                            >
                                {/* Cột nội dung bên trái */}
                                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                                item.engineUsed === "Gemini"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-purple-100 text-purple-700"
                                            }`}
                                        >
                                            {item.engineUsed}
                                        </span>
                                        <h3
                                            className="font-semibold text-slate-800 truncate"
                                            title={item.userInput}
                                        >
                                            {truncateText(item.userInput, 60)}
                                        </h3>
                                    </div>
                                    <p
                                        className="text-sm text-slate-500 truncate"
                                        title={item.engineResponse}
                                    >
                                        {truncateText(item.engineResponse, 100)}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(item.searchDate)}
                                    </div>
                                </div>

                                {/* Cột Action bên phải (Chỉ hiện khi hover trên Desktop) */}
                                <div className="flex items-center sm:opacity-0 group-hover:opacity-100 transition-opacity gap-1 shrink-0 self-end sm:self-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyResponse(
                                                item.id,
                                                item.engineResponse,
                                            );
                                        }}
                                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                                        title="Sao chép câu trả lời"
                                    >
                                        {copied === item.id ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteItem(item.id);
                                        }}
                                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                                        title="Xóa lịch sử này"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="p-2 text-slate-300">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex justify-end">
                    <Button
                        variant="ghost"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl px-6"
                        onClick={onClose}
                    >
                        Đóng cửa sổ
                    </Button>
                </div>
            </Card>
        </div>,
        document.body,
    );
}
