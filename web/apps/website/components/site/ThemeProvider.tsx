"use client";

import * as React from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "zenthcloud-theme";

type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggle: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	root.classList.toggle("dark", theme === "dark");
	root.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	// The inline script in the root layout sets the class before paint.
	const [theme, setThemeState] = React.useState<Theme>("light");

	React.useEffect(() => {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const initial: Theme =
			stored === "light" || stored === "dark"
				? stored
				: prefersDark
					? "dark"
					: "light";
		setThemeState(initial);
		applyTheme(initial);
	}, []);

	const setTheme = React.useCallback((next: Theme) => {
		setThemeState(next);
		applyTheme(next);
		try {
			window.localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// Storage can be unavailable in private modes; the theme still applies.
		}
	}, []);

	const toggle = React.useCallback(() => {
		setTheme(theme === "dark" ? "light" : "dark");
	}, [setTheme, theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggle }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const context = React.useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used inside ThemeProvider");
	}
	return context;
}

/** Runs before paint to avoid a flash of the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){}})();`;
