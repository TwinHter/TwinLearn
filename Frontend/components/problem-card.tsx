"use client";

import type { Problem } from "../lib/types";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface ProblemCardProps {
    problem: Problem;
    onClick: () => void;
}

export default function ProblemCard({ problem, onClick }: ProblemCardProps) {
    return (
        <Card
            onClick={onClick}
            className="
                group relative p-5 cursor-pointer
                border border-border rounded-xl
                bg-card hover:bg-accent/40
                transition-all duration-200
                hover:shadow-lg hover:border-blue-500/60
                active:scale-[0.99]
            "
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left side: title + badges */}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3
                            className="
                                text-lg font-semibold text-foreground
                                group-hover:text-blue-600 dark:group-hover:text-blue-400
                                transition-colors duration-150
                            "
                        >
                            {problem.title}
                        </h3>

                        <Badge
                            variant="outline"
                            className="
                                text-xs font-medium
                                border-0
                                bg-gradient-to-r from-blue-50 to-blue-100
                                dark:from-blue-900/30 dark:to-blue-800/20
                                text-blue-700 dark:text-blue-300
                                px-2 py-[2px] rounded-md
                            "
                        >
                            {problem.difficulty}
                        </Badge>

                        <Badge
                            variant="outline"
                            className="
                                text-xs font-medium
                                border-0
                                bg-gray-100 dark:bg-gray-800/60
                                text-gray-700 dark:text-gray-300
                                px-2 py-[2px] rounded-md
                            "
                        >
                            {problem.source}
                        </Badge>
                    </div>

                    {/* Topics */}
                    {problem.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {problem.topics.map((topic) => (
                                <span
                                    key={topic.id}
                                    className="
                                        inline-flex items-center gap-1 px-2 py-[3px]
                                        text-xs rounded-md font-medium
                                        bg-blue-50 dark:bg-blue-900/30
                                        text-blue-700 dark:text-blue-300
                                        transition-colors
                                    "
                                >
                                    {topic.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right side (optional future icons or difficulty indicator spot) */}
                <div className="hidden sm:flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-sm text-blue-500 dark:text-blue-400 font-medium">
                        Chi tiết →
                    </span>
                </div>
            </div>
        </Card>
    );
}
