// === ENUMS (Các kiểu dữ liệu cố định) ===
// (Những cái này của bạn đã rất chuẩn)

export type ProblemSource = "Codeforces" | "Leetcode" | "Hackerank" | "Other";
export type ChecklistStatus = "NotCompleted" | "InProgress" | "Completed";
export type EngineType = "Gemini" | "KnowledgeBase";

// === PROBLEMS & TOPICS ===
export interface Topic {
    id: number;
    name: string;
    description?: string;
}

export interface Problem {
    id: number;
    title: string;
    difficulty: number;
    description?: string;
    link?: string;
    source: ProblemSource;
    solutionCode?: string;
    topics: Topic[]; // Dùng Topic interface ở trên
}

export interface CreateProblemDto {
    title: string;
    difficulty: number;
    description?: string;
    link?: string;
    source: ProblemSource;
    topicIds: number[];
}

export interface UpdateProblemDto {
    title?: string;
    difficulty?: number;
    description?: string;
    link?: string;
    source?: ProblemSource;
    topicIds?: number[];
}

// === CHECKLIST ===
export interface ChecklistItem {
    id: number;
    status: ChecklistStatus;
    lastUpdated: string;
    problemId: number;
    problem: Problem;
    description?: string;
}

export interface CreateChecklistDto {
    problemId?: number;
    status?: ChecklistStatus;
    description?: string;
}

export interface UpdateChecklistDto {
    status?: ChecklistStatus;
    description?: string;
}

// === AI INTERACTIONS ===
export interface AiRequest {
    prompt: string;
}

export interface AiResponse {
    response: string;
    status: string;
    modelVersionUsed: string;
    errorMessage: string | null;
    timestamp: string;
}
export interface SearchHistory {
    id: number;
    userInput: string;
    engineResponse: string;
    engineUsed: EngineType;
    searchDate: string;
}

export interface SyntaxErrorItem {
    line: number;
    level: "SYNTAX" | "WARNING";
    message: string;
    fix: string;
    raw: string;
}

export interface AnalysisParsedResult {
    status: string; // "Failed", "Clean", "Error"...
    errors?: SyntaxErrorItem[];
    raw_log: string;
}

export interface KbFixBugResponse {
    status: string;
    analysisResult: string;
    createdAt: string;
}

export interface KbFixBugRequest {
    sourceCode: string;
}
