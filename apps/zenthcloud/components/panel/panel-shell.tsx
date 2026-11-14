"use client";

import {
	CaretRightIcon,
	CaretUpDownIcon,
	MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import {
	Button,
	LinkProvider,
	Sidebar,
	ZenthcloudLogo,
} from "@zenthcloud/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { resolveAppEnvironment } from "@/lib/product";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { useWorkspaceLicense } from "@/utils/hooks/use-workspace-license";
import {
	createNavigation,
	findActiveNavigation,
	isNavigationItemActive,
	organizationPath,
	type PanelNavigationItem,
} from "./navigation";
import { useOrganization } from "./organization-context";

/** Bridges the design system's links to the Next.js router. */
const PanelLink = forwardRef<
	HTMLAnchorElement,
	React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ href, ...rest }, ref) => (
	<NextLink ref={ref} href={href ?? "#"} {...rest} />
));
PanelLink.displayName = "PanelLink";

/**
 * One row of the sidebar. Implemented destinations navigate; the others are
 * declared so the tree matches the product, but stay disabled instead of
 * pointing at a route that does not exist yet.
 */
function NavigationRow({
	item,
	pathname,
}: {
	item: PanelNavigationItem;
	pathname: string;
}) {
	const content = (
		<>
			<span className="truncate">{item.label}</span>
			{item.badge && <Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>}
			{item.expandable && (
				<CaretRightIcon
					aria-hidden
					className="ml-auto size-3 shrink-0 text-zenth-subtle group-data-[state=collapsed]/sidebar:hidden"
				/>
			)}
		</>
	);

	if (!item.implemented) {
		return (
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					icon={item.icon}
					disabled
					tooltip={`${item.label} — bientôt disponible`}
					aria-label={`${item.label} (bientôt disponible)`}
					className="cursor-not-allowed opacity-55"
				>
					{content}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		);
	}

	const isActive = isNavigationItemActive(item, { pathname });

	return (
		<Sidebar.MenuItem>
			<Sidebar.MenuButton
				href={item.href}
				icon={item.icon}
				active={isActive}
				tooltip={item.label}
				aria-current={isActive ? "page" : undefined}
			>
				{content}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	);
}

/**
 * Shell of the `/{organizationId}` panel: the ZenthCloud navigation on the
 * left, the workspace page on the right.
 *
 * It is built on the official `@zenthcloud/react` Sidebar, so the collapse
 * behaviour, mobile sheet, tooltips and tokens are the design system's, not a
 * local reimplementation. The shell only decides which destinations exist for
 * this account (permissions, licence) and renders them.
 */
export function PanelShell({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { organization, activation, syncSession } = useOrganization();
	const { data: permissions } = api.user.getPermissions.useQuery();
	const { data: product } = api.settings.getProduct.useQuery();
	const { data: isCloud } = api.settings.isCloud.useQuery();
	const license = useWorkspaceLicense();
	const [query, setQuery] = useState("");
	const searchRef = useRef<HTMLInputElement>(null);

	const environment =
		resolveAppEnvironment({ product, isCloud }) === "cloud" ? "cloud" : "self";

	const navigation = createNavigation({
		organizationId: organization.id,
		environment,
		permissions,
		license,
	});

	// `asPath` is the URL the user is on; `pathname` is only the route pattern
	// (`/[organizationId]/home`), which never matches an absolute item href.
	const pathname = router.asPath.split("?")[0] ?? router.asPath;
	const active = findActiveNavigation(navigation, { pathname });

	const sections = useMemo(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return navigation.sections;
		return navigation.sections
			.map((section) => ({
				...section,
				items: section.items.filter((item) =>
					item.label.toLowerCase().includes(needle),
				),
			}))
			.filter((section) => section.items.length > 0);
	}, [navigation.sections, query]);

	// Ctrl/⌘ K focuses the quick search, matching the rest of the product.
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k")
				return;
			event.preventDefault();
			searchRef.current?.focus();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	return (
		<LinkProvider component={PanelLink}>
			<Sidebar.Provider defaultOpen>
				{/* `h-svh` keeps the rail at viewport height while the page scrolls, so
				    the footer is always anchored to the bottom of the sidebar. */}
				<Sidebar
					collapsible="icon"
					aria-label={`Navigation de ${title}`}
					className="sticky top-0 h-svh! self-start"
				>
					<Sidebar.Header>
						<ZenthcloudLogo
							variant="glyph"
							className="h-5 w-auto shrink-0"
							aria-hidden
						/>
						<span className="min-w-0 flex-1 truncate px-1 text-sm font-medium">
							{organization.name}
						</span>
						<CaretUpDownIcon
							aria-hidden
							className="size-3.5 shrink-0 text-zenth-subtle group-data-[state=collapsed]/sidebar:hidden"
						/>
					</Sidebar.Header>

					<Sidebar.Content>
						<div className="px-1 pb-2">
							<div className="flex items-center gap-2 rounded-lg border border-zenth-line bg-zenth-base px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-zenth-brand focus-within:ring-inset">
								<MagnifyingGlassIcon
									aria-hidden
									className="size-3.5 shrink-0 text-zenth-subtle"
								/>
								<input
									ref={searchRef}
									type="search"
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									placeholder="Recherche rapide"
									aria-label="Recherche rapide dans la navigation"
									className="min-w-0 flex-1 bg-transparent text-sm text-zenth-default outline-none placeholder:text-zenth-subtle"
								/>
								<kbd className="shrink-0 rounded border border-zenth-line px-1 text-[10px] text-zenth-subtle group-data-[state=collapsed]/sidebar:hidden">
									Ctrl K
								</kbd>
							</div>
						</div>

						{sections.map((section) => (
							<Sidebar.Group key={section.id}>
								{section.label && (
									<Sidebar.GroupLabel>{section.label}</Sidebar.GroupLabel>
								)}
								<Sidebar.Menu>
									{section.items.map((item) => (
										<NavigationRow
											key={item.id}
											item={item}
											pathname={pathname}
										/>
									))}
								</Sidebar.Menu>
							</Sidebar.Group>
						))}

						{/* The account entry sits at the end of the tree, right after the
						    last section, the way the reference panel groups it. The
						    collapse control stays outside the scroll area, at the very
						    bottom of the rail. */}
						<Sidebar.Group className="mt-3 border-t border-zenth-line pt-2">
							<Sidebar.Menu>
								{navigation.footer.map((item) => (
									<NavigationRow
										key={item.id}
										item={item}
										pathname={pathname}
									/>
								))}
							</Sidebar.Menu>
						</Sidebar.Group>

						{query.trim() && sections.length === 0 && (
							<p className="px-3 py-4 text-xs text-zenth-subtle">
								Aucune destination ne correspond à « {query.trim()} ».
							</p>
						)}
					</Sidebar.Content>

					{/* Only the collapse control lives below the scroll area: the account
					    entry is rendered once, at the end of the navigation tree above,
					    while this strip stays flush with the bottom edge of the rail. */}
					<Sidebar.Footer
						style={{ height: "auto" }}
						className="mt-auto flex-col items-stretch gap-0 p-0!"
					>
						<div className="border-t border-zenth-line px-[11px] pt-1.5 pb-2.5 group-not-data-[state=collapsed]/sidebar:px-3.5">
							<Sidebar.Trigger className="rounded-md border border-zenth-line bg-zenth-base" />
						</div>
					</Sidebar.Footer>
					<Sidebar.Rail />
				</Sidebar>

				<main
					className={cn(
						"flex min-h-svh min-w-0 flex-1 flex-col",
						"bg-zenth-base text-zenth-default",
					)}
				>
					{activation === "error" && (
						<div className="flex items-center gap-3 border-b border-zenth-line px-4 py-2 text-xs text-zenth-subtle">
							<span>
								La session n&apos;est pas encore rattachée à cet espace de
								travail.
							</span>
							<Button variant="ghost" size="sm" onClick={syncSession}>
								Réessayer
							</Button>
						</div>
					)}

					<div className="min-h-0 flex-1 overflow-y-auto">
						<div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
							{children}
						</div>
					</div>
				</main>
			</Sidebar.Provider>
		</LinkProvider>
	);
}
