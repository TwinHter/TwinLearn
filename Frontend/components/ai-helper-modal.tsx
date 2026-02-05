"use client";

import { useState } from "react";
import { X, Loader2, Copy, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Problem } from "../lib/types";

interface AiHelperModalProps {
    problem: Problem;
    onClose: () => void;
}

export default function AiHelperModal({
    problem,
    onClose,
}: AiHelperModalProps) {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const analyzeCode = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAnalysis(
            `## Analysis of "${problem.title}"\n\n**Approach:**\nThis problem requires understanding of ${problem.tags[0]}. The optimal solution involves breaking it down into smaller subproblems.\n\n**Time Complexity:** O(n log n)\n**Space Complexity:** O(n)\n\n**Key Steps:**\n1. Parse the input\n2. Apply the algorithm\n3. Return the result\n\n**Common Pitfalls:**\n- Edge cases with empty input\n- Integer overflow for large numbers\n- Off-by-one errors in loops`
        );
        setLoading(false);
    };

    const copyAnalysis = () => {
        if (analysis) {
            navigator.clipboard.writeText(analysis);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col m-4">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <div>
                        <h2 className="text-2xl font-bold">{problem.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {problem.description}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {!analysis ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Button
                                onClick={analyzeCode}
                                disabled={loading}
                                size="lg"
                                className="gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    "Analyze with AI"
                                )}
                            </Button>
                            <p className="text-sm text-muted-foreground mt-4">
                                Get instant AI-powered analysis and solutions
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="prose prose-invert max-w-none text-sm">
                                {analysis.split("\n\n").map((paragraph, idx) =>
                                    paragraph.startsWith("##") ? (
                                        <h3
                                            key={idx}
                                            className="text-lg font-semibold mt-4 mb-2"
                                        >
                                            {paragraph.replace("## ", "")}
                                        </h3>
                                    ) : paragraph.startsWith("**") &&
                                      paragraph.endsWith("**") ? (
                                        <p key={idx} className="font-semibold">
                                            {paragraph}
                                        </p>
                                    ) : paragraph.startsWith("- ") ? (
                                        <ul
                                            key={idx}
                                            className="list-disc list-inside space-y-1"
                                        >
                                            {paragraph
                                                .split("\n")
                                                .map((line, i) => (
                                                    <li
                                                        key={i}
                                                        className="text-muted-foreground"
                                                    >
                                                        {line.replace("- ", "")}
                                                    </li>
                                                ))}
                                        </ul>
                                    ) : (
                                        <p
                                            key={idx}
                                            className="text-muted-foreground"
                                        >
                                            {paragraph}
                                        </p>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 p-6 border-t border-border">
                    {analysis && (
                        <Button
                            onClick={copyAnalysis}
                            variant="outline"
                            className="gap-2 bg-transparent"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy Analysis
                                </>
                            )}
                        </Button>
                    )}
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="ml-auto bg-transparent"
                    >
                        Close
                    </Button>
                    {analysis && (
                        <Button onClick={analyzeCode} className="gap-2">
                            Analyze Again
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}
