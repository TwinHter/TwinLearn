"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import ProblemCard from "../components/problem-card";
import ProblemDetailModal from "../components/problem-detail-modal";
import type { Problem } from "../lib/types";
import { useTopicSearch } from "../hooks/useTopics";
import { useProblems } from "../hooks/useProblems";

export default function ProblemsPage() {
    // 🧠 State người dùng đang chọn
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSource, setSelectedSource] = useState<string | null>(null);
    const [minDifficulty, setMinDifficulty] = useState<number | null>(null);
    const [maxDifficulty, setMaxDifficulty] = useState<number | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

    // 🧩 Dropdown visibility
    const [showSourceFilter, setShowSourceFilter] = useState(false);
    const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
    const [showTopicsFilter, setShowTopicsFilter] = useState(false);

    // 🧩 Modal
    const [selectedProblem, setSelectedProblem] = useState<Problem | null>(
        null
    );

    // 🧱 Filter đang áp dụng (chỉ cập nhật khi nhấn nút Lọc)
    const [activeFilters, setActiveFilters] = useState({
        title: "",
        source: undefined as string | undefined,
        topicId: undefined as string | undefined,
        minDiff: undefined as number | undefined,
        maxDiff: undefined as number | undefined,
    });

    const { data: allTopics } = useTopicSearch();

    // Fetch dựa trên filter đang áp dụng
    const { data: problems = [] } = useProblems(activeFilters);

    const filteredProblems = useMemo(() => {
        return problems.filter((p: Problem) =>
            p.title?.toLowerCase().includes(activeFilters.title.toLowerCase())
        );
    }, [problems, activeFilters]);

    const sources = ["Leetcode", "Codeforces", "Other"];
    const difficultyLevels = [800, 1000, 1100, 1200, 1400, 1600, 1800, 2000];

    // 📌 Khi nhấn nút "Lọc"
    const handleApplyFilters = () => {
        setActiveFilters({
            title: searchQuery || "",
            source: selectedSource || undefined,
            topicId: selectedTopic ? selectedTopic.toString() : undefined,
            minDiff: minDifficulty || undefined,
            maxDiff: maxDifficulty || undefined,
        });
        setShowSourceFilter(false);
        setShowDifficultyFilter(false);
        setShowTopicsFilter(false);
    };

    // 📌 Khi nhấn "Xóa bộ lọc"
    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedSource(null);
        setSelectedTopic(null);
        setMinDifficulty(null);
        setMaxDifficulty(null);
        setActiveFilters({
            title: "",
            source: undefined,
            topicId: undefined,
            minDiff: undefined,
            maxDiff: undefined,
        });
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                    Problems
                </h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8 items-center">
                {/* Search */}
                <div className="flex-1 min-w-[260px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm bài toán..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>

                {/* Source filter */}
                <div className="relative">
                    <Button
                        onClick={() => setShowSourceFilter(!showSourceFilter)}
                        variant="outline"
                        className="gap-2 rounded-xl shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition"
                    >
                        Nguồn: {selectedSource || "Tất cả"}
                        <ChevronDown className="w-4 h-4 opacity-70" />
                    </Button>

                    {showSourceFilter && (
                        <div className="absolute top-full mt-2 bg-card border border-border rounded-xl shadow-lg z-10 min-w-48 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <button
                                onClick={() => {
                                    setSelectedSource(null);
                                    setShowSourceFilter(false);
                                }}
                                className="block w-full px-4 py-2 text-left hover:bg-accent text-sm"
                            >
                                Tất cả
                            </button>
                            {sources.map((source) => (
                                <button
                                    key={source}
                                    onClick={() => {
                                        setSelectedSource(source);
                                        setShowSourceFilter(false);
                                    }}
                                    className="block w-full px-4 py-2 text-left hover:bg-accent text-sm"
                                >
                                    {source}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Difficulty filter */}
                <div className="relative">
                    <Button
                        onClick={() =>
                            setShowDifficultyFilter(!showDifficultyFilter)
                        }
                        variant="outline"
                        className="gap-2 rounded-xl shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition"
                    >
                        Độ khó:{" "}
                        {minDifficulty && maxDifficulty
                            ? `${minDifficulty}-${maxDifficulty}`
                            : "Tất cả"}
                        <ChevronDown className="w-4 h-4 opacity-70" />
                    </Button>

                    {showDifficultyFilter && (
                        <div className="absolute top-full mt-2 bg-card border border-border rounded-xl shadow-lg z-10 min-w-56 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Độ khó tối thiểu:
                                </label>
                                <select
                                    value={minDifficulty || ""}
                                    onChange={(e) =>
                                        setMinDifficulty(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Không có</option>
                                    {difficultyLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Độ khó tối đa:
                                </label>
                                <select
                                    value={maxDifficulty || ""}
                                    onChange={(e) =>
                                        setMaxDifficulty(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Không có</option>
                                    {difficultyLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Topic filter */}
                <div className="relative">
                    <Button
                        onClick={() => setShowTopicsFilter(!showTopicsFilter)}
                        variant="outline"
                        className="gap-2 rounded-xl shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition"
                    >
                        Chủ đề:{" "}
                        {selectedTopic
                            ? allTopics?.find(
                                  (topic) => topic.id === selectedTopic
                              )?.name
                            : "Tất cả"}
                        <ChevronDown className="w-4 h-4 opacity-70" />
                    </Button>

                    {showTopicsFilter && (
                        <div className="absolute top-full mt-2 bg-card border border-border rounded-xl shadow-lg z-10 min-w-64 p-3 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                            <label className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer">
                                <input
                                    type="radio"
                                    name="topic"
                                    checked={selectedTopic === null}
                                    onChange={() => setSelectedTopic(null)}
                                    className="w-4 h-4 accent-blue-600"
                                />
                                <span className="text-sm">Tất cả</span>
                            </label>
                            {allTopics?.map(({ id, name }) => (
                                <label
                                    key={id}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-md cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="topic"
                                        checked={selectedTopic === id}
                                        onChange={() => setSelectedTopic(id)}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-sm">{name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* 🔘 Apply Filter */}
                <Button
                    onClick={handleApplyFilters}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2"
                >
                    <Filter className="w-4 h-4" />
                    Lọc
                </Button>

                {/* 🧹 Clear Filter */}
                <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="rounded-xl shadow-sm hover:bg-accent hover:text-accent-foreground"
                >
                    Xóa
                </Button>
            </div>

            {/* Problems list */}
            <div className="space-y-3">
                {filteredProblems.length > 0 ? (
                    filteredProblems.map((problem: Problem) => (
                        <ProblemCard
                            key={problem.id}
                            problem={problem}
                            onClick={() => setSelectedProblem(problem)}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/30">
                        Không tìm thấy bài toán nào phù hợp với bộ lọc của bạn
                        😕
                    </div>
                )}
            </div>

            {selectedProblem && (
                <ProblemDetailModal
                    problem={selectedProblem}
                    onClose={() => setSelectedProblem(null)}
                />
            )}
        </div>
    );
}
