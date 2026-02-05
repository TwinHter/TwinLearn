// lib/kb-types.ts

export interface DataType {
    id: string;
    label: string;
}

export interface Step {
    id: string;
    label: string; // UI thường dùng chữ "label" để hiển thị
    // description: string; // Có thể thêm nếu muốn hiện tooltip
}

export interface Problem {
    id: string;
    title: string;
    inputId: string[]; // Dùng string để hiển thị trên UI (vd: "n + Array")
    outputId: string; // ID của goal state
    description: string;
    correctSteps: string[]; // Để mảng rỗng như logic cũ
}

// Interface tổng hợp kết quả trả về từ Hook
export interface SolverData {
    inputTypes: DataType[];
    outputTypes: DataType[];
    steps: Step[];
    problems: Problem[];
}
export interface KbSolverRequest {
    type: 1 | 2; // 1 = Solve, 2 = Validate
    initial_state: string[]; // Map từ Problem.inputId
    goal: string; // Map từ Problem.outputId
    steps: string[]; // Mảng ID các bước (Rỗng nếu type=1)
}

// 2. Nội dung bên trong chuỗi "analysisResult" (Sau khi parse JSON)
export interface AnalysisResultParsed {
    type: 1 | 2;
    status: "success" | "fail" | "missing step" | "wrong" | "true" | "error";

    // Dành cho Type 1 (Solver)
    steps?: { id: string; description: string }[];

    // Dành cho Type 2 (Validator)
    detail?: string;
    error_step_index?: number;
}

// 3. Response DTO (Nhận từ Server - Outer envelope)
export interface KbSolverResponseRaw {
    status: string; // Status của C# wrapper
    analysisResult: string; // Chuỗi JSON stringified (Cần parse)
    createdAt: string;
}
