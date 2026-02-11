using System;

namespace Core.Enums;

public class AiTaskType
{
    public const string SYNTAX_CHECK_KB = "syntax_check_kb";
    public const string TASK_SOLVER_KB = "task_solver_kb";
    public const string SYNTAX_CHECK_LLM = "syntax_check_llm";
    public const string TASK_SOLVER_LLM = "task_solver_llm";
}
