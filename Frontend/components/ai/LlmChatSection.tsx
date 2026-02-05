"use client";

import { useState } from "react";
import { Send, Loader2, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useAnalyzeCode } from "../../hooks/useAiHelper"; // Hook cũ của bạn
import type { AiResponse } from "../../lib/types";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    modelUsed?: string;
}

export default function LlmChatSection() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

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
            const aiResponse: AiResponse =
                await analyzeCodeMutation.mutateAsync({
                    prompt: userInput,
                });

            let assistantContent = "";
            if (aiResponse.status === "Success") {
                assistantContent = aiResponse.response;
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
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="flex-1 flex flex-col p-5 overflow-hidden bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm rounded-2xl h-[600px]">
            {/* Toolbar */}
            {messages.length > 0 && (
                <div className="absolute top-4 right-4 z-10">
                    <Button
                        onClick={handleNewConversation}
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-slate-700"
                    >
                        <RotateCcw className="w-4 h-4 mr-1" /> Làm mới
                    </Button>
                </div>
            )}

            {/* Chat List */}
            <div className="flex-1 overflow-auto mb-4 space-y-4 pr-2 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                        <p className="text-sm mb-1">
                            Chưa có cuộc trò chuyện nào
                        </p>
                        <p className="text-xs">
                            Nhập câu hỏi để bắt đầu với LLM
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
                                className={`max-w-[85%] px-4 py-2 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words leading-relaxed ${
                                    message.role === "user"
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-slate-100 text-slate-800 rounded-bl-none"
                                }`}
                            >
                                {message.content}
                                {message.modelUsed && (
                                    <p className="text-[10px] text-right opacity-70 mt-1">
                                        ({message.modelUsed})
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-100 p-2 rounded-2xl rounded-bl-none">
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
                <Input
                    placeholder="Nhập câu hỏi..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={loading}
                    className="flex-1 rounded-xl focus-visible:ring-blue-500"
                />
                <Button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
}
