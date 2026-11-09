"use client";

import { Button, DropdownMenu, Link, LinkButton } from "@zenthcloud/react";
import { ArrowRight, CaretDown, CaretUpDown, List, X } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { searchIndex } from "@/lib/content/search-index";
import { cta, mainNav, utilityNav, type NavGroup } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import { Container } from "../Container";
import { LanguageSelector } from "./LanguageSelector";
import { SiteSearch } from "./SiteSearch";

function isActive(pathname: string, href: string) {
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(`${href}/`);
}

/** Every section must sit on one row, so the grid is sized to the section
 * count. Static strings keep Tailwind's scanner able to see each class. */
const COLUMN_GRID_CLASS: Record<number, string> = {
	1: "lg:grid-cols-1",
	2: "lg:grid-cols-2",
	3: "lg:grid-cols-3",
	4: "lg:grid-cols-4",
	5: "lg:grid-cols-5",
	6: "lg:grid-cols-6",
	7: "lg:grid-cols-7",
	8: "lg:grid-cols-8",
};

function columnGridClass(count: number) {
	return COLUMN_GRID_CLASS[Math.min(Math.max(count, 1), 8)] ?? "lg:grid-cols-4";
}

/** Utility action rendered as one of the outlined pills in the right cluster. */
function HeaderPill({
	href,
	label,
	external,
}: {
	href: string;
	label: string;
	external?: boolean;
}) {
	return (
		<LinkButton
			href={href}
			variant="outline"
			size="sm"
			external={external}
			className="h-8 rounded-full border-border bg-transparent px-3.5 text-[13px] font-medium text-foreground ring-0 hover:border-foreground/30 hover:bg-muted hover:text-foreground"
		>
			{label}
		</LinkButton>
	);
}

/**
 * Desktop navigation, built on the official `DropdownMenu` compound component:
 * one root per group, the trigger renders the library `Button`, and the panel
 * is the library popup (portal, positioner and surface handled for us).
 */
function DesktopNavItem({
	group,
	pathname,
}: {
	group: NavGroup;
	pathname: string;
}) {
	const active = isActive(pathname, group.href ?? "/");
	// The "More" section is rendered as the panel footer, like the reference:
	// one row of shortcuts beside "See all products".
	const moreColumn = group.columns.find((column) => column.title === "More");
	const columns = group.columns.filter((column) => column.title !== "More");
	const [open, setOpen] = React.useState(false);
	// The panel is anchored to the page centre, not to its trigger, so every
	// mega menu opens in the same place. The offset is measured on open.
	const [alignOffset, setAlignOffset] = React.useState(0);
	const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	const cancelClose = React.useCallback(() => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
	}, []);

	// Pointer entry opens the panel; leaving schedules a short close so moving
	// from the trigger into the panel does not dismiss it.
	const openMenu = React.useCallback(() => {
		cancelClose();
		setOpen(true);
	}, [cancelClose]);

	const scheduleClose = React.useCallback(() => {
		cancelClose();
		closeTimer.current = setTimeout(() => setOpen(false), 160);
	}, [cancelClose]);

	const handleTriggerOpen = React.useCallback(
		(event: React.SyntheticEvent<HTMLElement>) => {
			const rect = event.currentTarget.getBoundingClientRect();
			setAlignOffset(
				Math.round(window.innerWidth / 2 - (rect.left + rect.width / 2)),
			);
			openMenu();
		},
		[openMenu],
	);

	React.useEffect(() => cancelClose, [cancelClose]);
	React.useEffect(() => setOpen(false), [pathname]);

	if (group.columns.length === 0) {
		return (
			<Link
				href={group.href ?? "/"}
				variant="plain"
				aria-current={active ? "page" : undefined}
				className={cn(
					"inline-flex h-8 items-center text-sm font-medium no-underline! transition-colors",
					active
						? "text-foreground"
						: "text-foreground/75 hover:text-foreground",
				)}
			>
				{group.title}
			</Link>
		);
	}

	return (
		<div onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenu.Trigger>
				<Button
					variant="ghost"
					size="sm"
					onMouseEnter={handleTriggerOpen}
					onFocus={handleTriggerOpen}
					className={cn(
						"group h-8 gap-1.5 bg-transparent px-0 text-[13px] font-medium shadow-none hover:bg-transparent",
						active
							? "text-foreground"
							: "text-foreground/75 hover:text-foreground",
					)}
				>
					{group.title}
					<span className="flex size-[18px] items-center justify-center rounded-[5px] bg-muted text-foreground/60">
						<CaretUpDown
							className="size-2.5"
							weight="bold"
							aria-hidden="true"
						/>
					</span>
				</Button>
			</DropdownMenu.Trigger>
				<DropdownMenu.Content
					onMouseEnter={openMenu}
					onMouseLeave={scheduleClose}
					align="center"
					alignOffset={alignOffset}
					sideOffset={14}
				collisionPadding={16}
				className="w-[min(1360px,calc(100vw-2rem))] border border-border bg-popover p-2 text-popover-foreground shadow-lg"
			>
				<nav aria-label={`${group.title} menu`}>
					<div
						className={cn(
							"grid divide-y divide-border overflow-hidden rounded-md border border-border lg:divide-x lg:divide-y-0",
							columnGridClass(columns.length),
						)}
					>
						{columns.map((column) => (
							<DropdownMenu.Group key={column.title} className="min-w-0 p-3 xl:p-4">
								<DropdownMenu.Label className="mb-3 px-0 text-[13px] font-medium text-muted-foreground">
									{column.title}
								</DropdownMenu.Label>
								{column.links.map((item) => (
									<DropdownMenu.LinkItem
										key={`${column.title}-${item.label}-${item.href}`}
										href={item.href}
										target={item.external ? "_blank" : undefined}
										rel={item.external ? "noreferrer" : undefined}
										className="flex-col items-start gap-0.5 rounded-md px-2 py-2 text-foreground"
									>
										<span className="text-sm font-medium leading-snug">
											{item.label}
										</span>
										{item.description && (
											<span className="text-xs leading-snug text-muted-foreground">
												{item.description}
											</span>
										)}
									</DropdownMenu.LinkItem>
								))}
							</DropdownMenu.Group>
						))}
					</div>
				</nav>

				<div className="mt-2 flex flex-col gap-3 border-t border-border px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-wrap items-center gap-2">
						{group.href && (
							<LinkButton
								href={group.href}
								variant="ghost"
								size="sm"
								className="text-primary"
							>
								See all {group.title.toLowerCase()}
								<ArrowRight className="size-3.5" aria-hidden="true" />
							</LinkButton>
						)}
					</div>
					<ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
						{(moreColumn?.links ?? utilityNav).map((item) => (
							<li key={item.label}>
								<Link
									href={item.href}
									variant="plain"
									target={"external" in item && item.external ? "_blank" : undefined}
									rel={"external" in item && item.external ? "noreferrer" : undefined}
									className="text-muted-foreground no-underline! transition-colors hover:text-foreground"
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
				</DropdownMenu.Content>
			</DropdownMenu>
		</div>
	);
}

function MobileMenu({
	open,
	onClose,
	pathname,
}: {
	open: boolean;
	onClose: () => void;
	pathname: string;
}) {
	React.useEffect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-border bg-popover text-popover-foreground lg:hidden">
			<Container className="py-6">
				<nav aria-label="Mobile">
					<ul className="space-y-1">
						{mainNav.map((group) => (
							<li key={group.title}>
								{group.columns.length === 0 ? (
									<Link
										href={group.href ?? "/"}
										variant="current"
										onClick={onClose}
										aria-current={
											isActive(pathname, group.href ?? "/")
												? "page"
												: undefined
										}
										className="block rounded-md px-2 py-3 text-base font-medium no-underline hover:bg-foreground/[0.06]"
									>
										{group.title}
									</Link>
								) : (
									<details className="group rounded-md">
										<summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-3 text-base font-medium hover:bg-foreground/[0.06] [&::-webkit-details-marker]:hidden">
											{group.title}
											<CaretDown
												className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
												aria-hidden="true"
											/>
										</summary>
										<div className="pb-2 pl-2">
											{group.columns.map((column) => (
												<div key={column.title} className="mb-2">
													<p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
														{column.title}
													</p>
													<ul>
														{column.links.map((item) => (
															<li key={`${column.title}-${item.label}-${item.href}`}>
																<Link
																	href={item.href}
																	variant="current"
																	target={item.external ? "_blank" : undefined}
																	rel={
																		item.external ? "noreferrer" : undefined
																	}
																	onClick={onClose}
																	className="block rounded-md px-2 py-2 text-sm text-muted-foreground no-underline hover:bg-foreground/[0.06] hover:text-foreground"
																>
																	{item.label}
																</Link>
															</li>
														))}
													</ul>
												</div>
											))}
											<LinkButton
												href={group.href ?? "/"}
												variant="ghost"
												size="sm"
												onClick={onClose}
												className="px-2 text-primary"
											>
												View all {group.title.toLowerCase()}
											</LinkButton>
										</div>
									</details>
								)}
							</li>
						))}
					</ul>
				</nav>

				<div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
					{utilityNav.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							variant="current"
							target={item.external ? "_blank" : undefined}
							rel={item.external ? "noreferrer" : undefined}
							className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground no-underline hover:border-foreground/30 hover:text-foreground"
						>
							{item.label}
						</Link>
					))}
					<div className="ml-auto flex items-center gap-1">
						<LanguageSelector variant="ghost" />
					</div>
				</div>

				<div className="mt-4 grid gap-2 border-t border-border pt-4">
					<LinkButton
						href={cta.primary.href}
						variant="primary"
						onClick={onClose}
						className="w-full justify-center"
					>
						{cta.primary.label}
					</LinkButton>
					<LinkButton
						href={cta.signIn.href}
						variant="secondary"
						external
						onClick={onClose}
						className="w-full justify-center"
					>
						{cta.signIn.label}
					</LinkButton>
				</div>
			</Container>
		</div>
	);
}

export function SiteHeader() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = React.useState(false);

	React.useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background text-foreground">
			<Container>
				<div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-6">
					<Link
						href="/"
						variant="plain"
						aria-label="ZenthCloud home"
						className="flex shrink-0 items-center no-underline!"
					>
						<span className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
							ZenthCloud
						</span>
					</Link>

					<div className="hidden justify-center lg:flex">
						<nav aria-label="Main">
							<ul className="flex items-center gap-8">
								{mainNav.map((group) => (
									<li key={group.title}>
										<DesktopNavItem group={group} pathname={pathname} />
									</li>
								))}
							</ul>
						</nav>
					</div>

					<div className="ml-auto flex items-center gap-4 justify-self-end">
						<nav aria-label="Utility" className="hidden items-center gap-2.5 md:flex">
							<HeaderPill
								href={cta.signIn.href}
								label={cta.signIn.label}
								external
							/>
							<HeaderPill href={cta.secondary.href} label={cta.secondary.label} />
						</nav>
						<SiteSearch
							entries={searchIndex}
							variant="icon"
							className="text-muted-foreground hover:bg-muted hover:text-foreground"
						/>
						<Button
							variant="ghost"
							shape="square"
							size="sm"
							onClick={() => setMobileOpen((value) => !value)}
							aria-expanded={mobileOpen}
							aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
							className="text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
						>
							{mobileOpen ? (
								<X className="size-5" aria-hidden="true" />
							) : (
								<List className="size-5" aria-hidden="true" />
							)}
						</Button>
					</div>
				</div>
			</Container>

			<MobileMenu
				open={mobileOpen}
				onClose={() => setMobileOpen(false)}
				pathname={pathname}
			/>
		</header>
	);
}
