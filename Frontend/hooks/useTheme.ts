import { useCallback, useEffect, useState } from "react";

function getInitialTheme(): "light" | "dark" {
    try {
        const stored = localStorage.getItem("theme");
        if (stored === "dark" || stored === "light") return stored;
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        )
            return "dark";
    } catch (e) {}
    return "light";
}

export default function useTheme() {
    const [theme, setTheme] = useState<"light" | "dark">(() =>
        getInitialTheme()
    );

    useEffect(() => {
        try {
            if (theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            localStorage.setItem("theme", theme);
        } catch (e) {}
    }, [theme]);

    const toggle = useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    return { theme, setTheme, toggle };
}
