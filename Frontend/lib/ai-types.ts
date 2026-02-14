import { AiResponseStatus } from "./constants";

export interface GeminiRequest {
    prompt: string;
    context?: string;
    taskType: string; // Có thể thay bằng Enum AiTaskType của bạn nếu có
}

export interface GeminiResponse {
    response?: string;
    status?: string; // Có thể thay bằng Enum AiResponseStatus
    errorMessage?: string;
    modelVersionUsed?: string;
    timestamp: string;
    processingTimeMs?: number;
}
export interface KbFixBugRequest {
    sourceCode: string;
}

export interface KbFixBugItem {
    line?: number;
    level?: string;
    message: string;
    fix?: string;
    raw?: string;
}
export interface KbFixBugResponse {
    status: AiResponseStatus;
    analysisResult: string;
    createdAt: string;
    processingTimeMs?: number;
    error?: string;
}
export interface ParsedFixBugAnalysis {
    status: AiResponseStatus;
    raw_log?: string;
    error?: string;
    

    analysisResult?: KbFixBugItem[];
    createdAt: string;
    processingTimeMs?: number;
}

export interface KbSolverRequest {
    type: 1 | 2; // 1 = Solve, 2 = Validate
    initial_state: string[]; // BẮT BUỘC là snake_case vì Backend C# dùng [JsonPropertyName("initial_state")]
    goal: string;
    steps?: string[]; // Đã đổi thành optional (?) khớp với C# (List<string>?)
}

export interface KbSolverResponse {
    status: AiResponseStatus;
    analysisResult: string; // Chuỗi JSON string (Cần JSON.parse() khi dùng)
    createdAt: string;
    processingTimeMs?: number;
    error?: string;
}

export interface ParsedSolverAnalysis {
    type: 1 | 2;
    status: AiResponseStatus;

    // -- Dữ liệu trả về nếu Type = 1 (Solve) --
    steps?: {
        id: string;
        description: string;
    }[];
    error?: string;

    createdAt?: string;
    processingTimeMs?: number;
}
