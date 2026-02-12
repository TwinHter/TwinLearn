import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
PROMPT_DIR = BASE_DIR / "prompts"
ENV_PATH = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_PATH, override=True)


class Settings:
    def __init__(self):
        self.db_host = self._require_env("DB_HOST")
        self.db_port = int(os.getenv("DB_PORT", 5432))
        self.db_name = self._require_env("DB_NAME")
        self.db_user = self._require_env("DB_USER")
        self.db_password = self._require_env("DB_PASSWORD")
        self.llm_api_key = self._require_env("LLM_API_KEY")
        self.llm_model = os.getenv("LLM_MODEL")

        self.syntax_check_prompt = self._load_prompt("syntax_check.txt")
        self.task_solver_prompt = self._load_prompt("task_solver.txt")

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://"
            f"{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    def _load_prompt(self, filename: str) -> str:
        path = PROMPT_DIR / filename
        if not path.exists():
            raise RuntimeError(f"Prompt file not found: {path}")
        return path.read_text(encoding="utf-8")

    def _require_env(self, key: str) -> str:
        value = os.getenv(key)
        if not value:
            raise RuntimeError(f"Missing required environment variable: {key}")
        return value


settings = Settings()
