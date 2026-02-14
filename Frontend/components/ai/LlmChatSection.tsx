"use client";

import { useState } from "react";
import { Send, Loader2, RotateCcw, Code, Lightbulb } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useAnalyzeCode } from "../../hooks/useAiHelper";
import type { GeminiResponse } from "../../lib/ai-types";
import { TaskType } from "../../lib/constants";

// Thêm processingTimeMs vào interface Message
interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    modelUsed?: string;
    createdAt?: string;
    processingTimeMs?: number;
}

// Định nghĩa các loại Task

export default function LlmChatSection() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // Thêm state để quản lý Task Type hiện tại
    const [taskType, setTaskType] = useState<TaskType>("syntax_check_llm");

    const analyzeCodeMutation = useAnalyzeCode();

    const handleNewConversation = () => {
        setMessages([]);
        setInput("");
    };

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;
        setLoading(true);

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        const userInput = input;
        setInput("");

        try {
            // Gửi kèm taskType trong Request
            const aiResponse: GeminiResponse =
                await analyzeCodeMutation.mutateAsync({
                    prompt: userInput,
                    taskType: taskType,
                    // Không gửi context như yêu cầu
                });

            let assistantContent = "";
            if (
                aiResponse.status === "Success" ||
                aiResponse.status === "success"
            ) {
                assistantContent =
                    aiResponse.response || "Không có nội dung trả về.";
            } else {
                assistantContent = `Đã xảy ra lỗi: ${
                    aiResponse.errorMessage || "Không rõ nguyên nhân"
                }`;
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: assistantContent,
                modelUsed: aiResponse.modelVersionUsed,
                createdAt: aiResponse.timestamp, // Map từ timestamp của GeminiResponse
                processingTimeMs: aiResponse.processingTimeMs, // Lấy thời gian xử lý
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error communicating with AI:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
                    createdAt: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="flex-1 flex flex-col p-5 overflow-hidden bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm rounded-2xl h-[600px]">
            {/* Header / Toolbar (Mới) */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 shrink-0">
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTaskType("syntax_check_llm")}
                        className={`text-xs px-3 py-1 h-8 rounded-md transition-all ${
                            taskType === "syntax_check_llm"
                                ? "bg-white shadow-sm text-blue-600 font-medium hover:bg-white hover:text-blue-700"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <Code className="w-4 h-4 mr-1.5" />
                        Syntax Check
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTaskType("task_solver_llm")}
                        className={`text-xs px-3 py-1 h-8 rounded-md transition-all ${
                            taskType === "task_solver_llm"
                                ? "bg-white shadow-sm text-blue-600 font-medium hover:bg-white hover:text-blue-700"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        <Lightbulb className="w-4 h-4 mr-1.5" />
                        Task Solver
                    </Button>
                </div>

                {messages.length > 0 && (
                    <Button
                        onClick={handleNewConversation}
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-8 text-xs"
                    >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Làm mới
                    </Button>
                )}
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                        <div className="bg-slate-100 p-4 rounded-full mb-3">
                            {taskType === "syntax_check_llm" ? (
                                <Code className="w-6 h-6 text-blue-500" />
                            ) : (
                                <Lightbulb className="w-6 h-6 text-yellow-500" />
                            )}
                        </div>
                        <p className="text-sm font-medium mb-1">
                            {taskType === "syntax_check_llm"
                                ? "Chế độ Kiểm tra Cú pháp"
                                : "Chế độ Giải quyết Bài toán"}
                        </p>
                        <p className="text-xs max-w-[250px] text-slate-400">
                            Nhập câu hỏi hoặc đoạn code của bạn để bắt đầu phân
                            tích với LLM.
                        </p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words leading-relaxed ${
                                    message.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-sm"
                                        : "bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200"
                                }`}
                            >
                                {/* Nội dung tin nhắn */}
                                <div>{message.content}</div>

                                {/* Thông tin Metadata của Bot (Model & Time) */}
                                {message.role === "assistant" && (
                                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-medium">
                                        {message.modelUsed && (
                                            <span className="flex items-center gap-1">
                                                🤖 {message.modelUsed}
                                            </span>
                                        )}
                                        {message.processingTimeMs !==
                                            undefined && (
                                            <span className="flex items-center gap-1">
                                                ⏱{" "}
                                                {message.processingTimeMs.toFixed(
                                                    2,
                                                )}{" "}
                                                ms
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-slate-100 text-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-slate-200 shadow-sm flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            <span className="text-xs font-medium text-slate-500">
                                Đang phân tích...
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2 mt-auto pt-2 shrink-0">
                <Input
                    placeholder={
                        taskType === "syntax_check_llm"
                            ? "Nhập code cần kiểm tra..."
                            : "Nhập bài toán cần giải quyết..."
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        // Tránh gửi khi nhấn Shift + Enter (xuống dòng)
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    disabled={loading}
                    className="flex-1 rounded-xl focus-visible:ring-blue-500 bg-slate-50"
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4 shadow-sm"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
}
