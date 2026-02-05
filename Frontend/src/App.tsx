"use client";

import { useState } from "react";
import Navigation from "../components/navigation";
import Navbar from "../components/navbar";
import ChecklistPage from "../components/checklist-page";
import ProblemsPage from "../components/problems-page";
import AiHelperPage from "../components/ai-helper-page";
import IntroductionPage from "../components/introduction-page";
import { useSearchHistory } from "../hooks/useSearchHistory";
import type { SearchHistory } from "lib/types";
import { motion, AnimatePresence } from "framer-motion";

type PageType = "introduction" | "checklist" | "problems" | "ai-helper";

export default function App() {
    const [currentPage, setCurrentPage] = useState<PageType>("introduction");
    const { data: history } = useSearchHistory();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    return (
        <main className="flex h-screen bg-gradient-to-br from-slate-50 to-white text-foreground overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence initial={false}>
                {sidebarOpen && (
                    <motion.div
                        key="sidebar"
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}
                        className="z-20"
                    >
                        <Navigation
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            onToggleSidebar={() => setSidebarOpen(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar
                    history={history as SearchHistory[]}
                    sidebarOpen={sidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <div className="flex-1 overflow-auto p-6 bg-white/50 backdrop-blur-md">
                    <AnimatePresence mode="wait">
                        {currentPage === "introduction" && (
                            <motion.div
                                key="introduction"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <IntroductionPage onNavigate={setCurrentPage} />
                            </motion.div>
                        )}
                        {currentPage === "checklist" && (
                            <motion.div
                                key="checklist"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <ChecklistPage />
                            </motion.div>
                        )}
                        {currentPage === "problems" && (
                            <motion.div
                                key="problems"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <ProblemsPage />
                            </motion.div>
                        )}
                        {currentPage === "ai-helper" && (
                            <motion.div
                                key="ai-helper"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <AiHelperPage />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
