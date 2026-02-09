-- init.sql
CREATE TABLE syntax_kb IF NOT EXISTS (
    id TEXT PRIMARY KEY,
    pattern TEXT NOT NULL,
    type TEXT,
    msg TEXT,
    fix TEXT NOT NULL
);

CREATE TABLE solver_state IF NOT EXISTS (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT
);

CREATE TABLE solver_step IF NOT EXISTS (
    id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    preconditions TEXT[],
    effects TEXT[]
);

CREATE TABLE solver_problem IF NOT EXISTS (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    initial_states TEXT[] NOT NULL, 
    goal TEXT REFERENCES solver_state(id)
);