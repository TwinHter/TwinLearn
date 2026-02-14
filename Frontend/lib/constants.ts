export type ProblemSource = "Codeforces" | "Leetcode" | "Hackerank" | "Other";
export type ChecklistStatus = "NotCompleted" | "InProgress" | "Completed";
export type EngineType = "Gemini" | "KnowledgeBase";
export type TaskType =
    | "syntax_check_kb"
    | "syntax_check_llm"
    | "task_solver_kb"
    | "task_solver_llm";

export type AiResponseStatus = "Success" | "SystemFailed" | "Error";
