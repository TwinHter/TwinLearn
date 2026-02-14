"use client";

import { History, User, Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";
import SearchHistoryModal from "../components/search-history-modal";
import type { SearchHistory } from "../lib/types";
import {
    useSearchHistory,
    useDeleteHistoryItem,
} from "../hooks/useSearchHistory";

import useTheme from "../hooks/useTheme";

interface NavbarProps {
    history: SearchHistory[];
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
}

export default function Navbar({ sidebarOpen, onToggleSidebar }: NavbarProps) {
    const [showHistory, setShowHistory] = useState(false);
    const { data: historyData } = useSearchHistory();
    const deleteHistoryMutation = useDeleteHistoryItem();

    const handleDeleteHistory = (id: number) => {
        deleteHistoryMutation.mutate(id);
    };
    const { theme, toggle } = useTheme();

    return (
        <nav className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="px-6 py-3 flex items-center justify-between">
                {/* Left: Sidebar Toggle + Logo */}
                <div className="flex items-center gap-3">
                    <Button
                        onClick={onToggleSidebar}
                        variant="ghost"
                        size="icon"
                        className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all duration-300 hover:scale-105"
                        title={
                            sidebarOpen
                                ? "Ẩn thanh sidebar"
                                : "Hiện thanh sidebar"
                        }
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
                        TwinLearn
                    </h1>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    {/* Lịch sử */}
                    {/* Theme toggle placed next to profile icons */}
                    <Button
                        onClick={() => setShowHistory(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-lg border-slate-300 bg-white/60 hover:bg-slate-100 hover:border-slate-400 text-slate-700 font-medium transition-all duration-300 hover:shadow-sm"
                    >
                        <History className="w-4 h-4 text-slate-600" />
                        <span>Lịch sử</span>
                    </Button>

                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300">
                            <User className="w-5 h-5 text-white" />
                        </div>

                        <div className="absolute right-0 mt-3 w-40 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 transform group-hover:-translate-y-1">
                            <div className="bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg text-sm p-3">
                                <p className="text-slate-800 font-semibold">
                                    Đăng Nguyên
                                </p>
                                <p className="text-slate-500 text-xs mt-1">
                                    Nhà phát triển
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Lịch sử */}
            {showHistory && (
                <SearchHistoryModal
                    onClose={() => setShowHistory(false)}
                    history={historyData || []}
                    onDeleteHistory={handleDeleteHistory}
                />
            )}
        </nav>
    );
}
