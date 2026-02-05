"use client";

import { useState } from "react";
import { X, Copy, Check, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import type { Problem } from "../lib/types";

interface ProblemDetailModalProps {
    problem: Problem;
    onClose: () => void;
}

export default function ProblemDetailModal({
    problem,
    onClose,
}: ProblemDetailModalProps) {
    const [copiedCode, setCopiedCode] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const copyCode = () => {
        if (problem.solutionCode) {
            navigator.clipboard.writeText(problem.solutionCode);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const handleViewSolution = () => {
        setShowConfirmation(true);
    };

    const confirmViewSolution = () => {
        setShowSolution(true);
        setShowConfirmation(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
            {/* Hộp xác nhận xem giải pháp */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-60">
                    <Card className="w-full max-w-sm m-4 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl animate-fade-in">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-lg text-foreground">
                                    Xem giải pháp?
                                </h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                Có chắc chắn bạn muốn xem giải pháp? Hãy thử tự
                                giải quyết bài toán trước nhé.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    onClick={() => setShowConfirmation(false)}
                                    variant="outline"
                                    className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={confirmViewSolution}
                                    className="bg-blue-600 hover:bg-blue-700 shadow-md"
                                >
                                    Xem giải pháp
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Thân modal chính */}
            <Card className="w-full max-w-3xl max-h-[90vh] flex flex-col m-4 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl animate-fade-in bg-white dark:bg-slate-950">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-border bg-gradient-to-r from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                                {problem.title}
                            </h2>
                            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0">
                                {problem.difficulty}
                            </Badge>
                            <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0">
                                {problem.source}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {problem.description}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-red-500 transition-transform hover:scale-110 shrink-0"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Nội dung */}
                <div className="flex-1 overflow-auto p-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-foreground mb-3">
                            Nội dung bài toán
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {problem.description}
                        </p>
                    </div>

                    {problem.solutionCode && (
                        <div>
                            <h3 className="font-semibold text-foreground mb-3">
                                Mã giải pháp
                            </h3>
                            {!showSolution ? (
                                <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-6 flex items-center justify-center min-h-24 border border-dashed border-slate-300 dark:border-slate-700">
                                    <Button
                                        onClick={handleViewSolution}
                                        className="bg-blue-600 hover:bg-blue-700 shadow-md"
                                    >
                                        Xem giải pháp
                                    </Button>
                                </div>
                            ) : (
                                <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-auto border border-slate-800">
                                    <pre className="text-xs text-slate-100 font-mono whitespace-pre-wrap leading-relaxed">
                                        {problem.solutionCode}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    {problem.topics.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-foreground mb-3">
                                Chủ đề
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                                {problem.topics.map((topic) => (
                                    <Badge
                                        key={topic.id}
                                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 hover:bg-blue-200/70 dark:hover:bg-blue-800/50 transition"
                                    >
                                        {topic.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-border bg-slate-50 dark:bg-slate-900/40">
                    {problem.link && (
                        <Button
                            onClick={() => window.open(problem.link, "_blank")}
                            className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Xem bài toán
                        </Button>
                    )}
                    {problem.solutionCode && showSolution && (
                        <Button
                            onClick={copyCode}
                            variant="outline"
                            className="gap-2 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            {copiedCode ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Đã sao chép
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Sao chép mã
                                </>
                            )}
                        </Button>
                    )}
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="ml-auto bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                        Đóng
                    </Button>
                </div>
            </Card>
        </div>
    );
}
