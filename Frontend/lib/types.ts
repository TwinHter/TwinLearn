import {
    AiResponseStatus,
    ChecklistStatus,
    EngineType,
    ProblemSource,
    TaskType,
} from "./constants";

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
    topics: Topic[];
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

export interface SearchHistory {
    id: number;
    userInput: string;
    engineResponse: string;
    engineUsed?: EngineType;
    searchDate: string;
}

export interface DataType {
    id: string;
    label: string;
}

export interface Step {
    id: string;
    label: string;
}

export interface SolverProblem {
    id: string;
    title: string;
    inputIds: DataType[];
    outputId: string;
}

export interface SolverData {
    inputTypes: DataType[];
    outputTypes: DataType[];
    steps: Step[];
    problems: SolverProblem[];
}
