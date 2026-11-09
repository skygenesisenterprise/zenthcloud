"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({
	className,
	variant = "default",
}: {
	className?: string;
	variant?: "default" | "ghost";
}) {
	const { theme, toggle } = useTheme();
	const nextLabel = theme === "dark" ? "light" : "dark";

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={`Switch to ${nextLabel} theme`}
			title={`Switch to ${nextLabel} theme`}
			className={`inline-flex h-9 w-9 items-center justify-center transition-colors ${
				variant === "ghost"
					? "rounded-full text-ink-foreground/65 hover:bg-ink-foreground/10 hover:text-ink-foreground"
					: "rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
			} ${className ?? ""}`}
		>
			{theme === "dark" ? (
				<Sun className="h-4 w-4" aria-hidden="true" />
			) : (
				<Moon className="h-4 w-4" aria-hidden="true" />
			)}
		</button>
	);
}
