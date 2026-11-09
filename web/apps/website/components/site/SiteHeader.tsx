'use client'

import { ChevronDown, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import { searchIndex } from '@/lib/content/search-index'
import { cta, mainNav, utilityNav } from '@/lib/content/site'
import { cn } from '@/lib/utils'
import { Container } from '../Container'
import { Button } from '../ui/button'
import { LanguageSelector } from './LanguageSelector'
import { Logo } from '../shared/Logo'
import { SiteSearch } from './SiteSearch'
import { ThemeToggle } from './ThemeToggle'

type NavGroup = (typeof mainNav)[number]

const PANEL_ID = 'mega-panel'

const navTrigger =
	'inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors'

const panelUtilities = [
	{ href: '/solutions/enterprise', label: 'Enterprise' },
	{ href: '/infrastructure/locations', label: 'Global network' },
	{ href: '/products/domain-services', label: 'Domains' },
] as const

function isActive(pathname: string, href: string) {
	if (href === '/') return pathname === '/'
	return pathname === href || pathname.startsWith(`${href}/`)
}

function DesktopMenu({
	group,
	open,
	onOpen,
	onClose,
	pathname,
}: {
	group: NavGroup
	open: boolean
	onOpen: () => void
	onClose: () => void
	pathname: string
}) {
	const active = isActive(pathname, group.href ?? '/')

	if (group.columns.length === 0) {
		return (
			<Link
				href={group.href ?? '/'}
				aria-current={active ? 'page' : undefined}
				className={cn(
					navTrigger,
					'border-transparent',
					active
						? 'text-ink-foreground'
						: 'text-ink-foreground/70 hover:text-ink-foreground',
				)}
			>
				{group.title}
			</Link>
		)
	}

	return (
		<button
			type="button"
			aria-expanded={open}
			aria-controls={PANEL_ID}
			onMouseEnter={onOpen}
			onClick={() => (open ? onClose() : onOpen())}
			onKeyDown={(event) => {
				if (event.key === 'Escape') onClose()
			}}
			className={cn(
				navTrigger,
				open
					? 'border-ink-foreground/30 bg-ink-foreground/[0.04] text-ink-foreground'
					: cn(
							'border-transparent',
							active
								? 'text-ink-foreground'
								: 'text-ink-foreground/70 hover:text-ink-foreground',
						),
			)}
		>
			{group.title}
			<ChevronDown
				className={cn('h-3 w-3 transition-transform duration-150', open && 'rotate-180')}
				aria-hidden="true"
			/>
		</button>
	)
}

function MegaPanel({
	group,
	onClose,
	panelRef,
}: {
	group: NavGroup
	onClose: () => void
	panelRef: React.Ref<HTMLDivElement>
}) {
	const count = group.columns.length
	const columns =
		count >= 6
			? 'lg:grid-cols-3 xl:grid-cols-6'
			: count === 5
				? 'lg:grid-cols-3 xl:grid-cols-5'
				: count === 4
					? 'lg:grid-cols-4'
					: count === 3
						? 'lg:grid-cols-3'
						: 'lg:grid-cols-2'

	return (
		<div
			ref={panelRef}
			id={PANEL_ID}
			className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1 absolute left-1/2 top-full z-50 w-[calc(100vw-2rem)] max-w-[1352px] -translate-x-1/2 motion-safe:duration-150"
		>
			<div className="border-ink-foreground/15 bg-ink text-ink-foreground rounded-xl border p-2">
				<nav aria-label={`${group.title} menu`}>
					<div
						className={cn(
							'border-ink-foreground/10 divide-ink-foreground/[0.08] grid divide-y overflow-hidden rounded-md border lg:divide-x lg:divide-y-0',
							columns,
						)}
					>
						{group.columns.map((column) => (
							<div key={column.title} className="p-5 xl:p-6">
								<p className="text-ink-foreground/55 mb-5 text-[13px] font-medium">
									{column.title}
								</p>
								<ul className="space-y-6">
									{column.links.map((link) => (
										<li key={`${column.title}-${link.label}-${link.href}`}>
											<Link
												href={link.href}
												target={link.external ? '_blank' : undefined}
												rel={link.external ? 'noreferrer' : undefined}
												onClick={onClose}
												className="focus-visible:outline-signal group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
											>
												<span className="text-ink-foreground group-hover:text-signal block text-sm font-medium leading-snug transition-colors">
													{link.label}
												</span>
												{link.description && (
													<span className="text-ink-foreground/60 mt-1 block text-sm leading-snug">
														{link.description}
													</span>
												)}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</nav>

				<div className="border-ink-foreground/10 mt-2 flex flex-col gap-3 border-t px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
					{group.href && (
						<Link
							href={group.href}
							onClick={onClose}
							className="text-signal text-xs font-medium underline-offset-4 hover:underline"
						>
							See all {group.title.toLowerCase()} <span aria-hidden="true">→</span>
						</Link>
					)}
					<ul className="text-ink-foreground/55 flex flex-wrap gap-x-8 gap-y-2 text-xs">
						{panelUtilities.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									onClick={onClose}
									className="hover:text-ink-foreground transition-colors"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}

function MobileMenu({
	open,
	onClose,
	pathname,
}: {
	open: boolean
	onClose: () => void
	pathname: string
}) {
	React.useEffect(() => {
		if (!open) return
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}
		window.addEventListener('keydown', onKeyDown)
		return () => {
			document.body.style.overflow = previous
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [open, onClose])

	if (!open) return null

	return (
		<div className="border-ink-foreground/10 bg-ink text-ink-foreground motion-safe:animate-in motion-safe:fade-in-0 fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t motion-safe:duration-150 lg:hidden">
			<Container className="py-6">
				<nav aria-label="Mobile">
					<ul className="space-y-1">
						{mainNav.map((group) => (
							<li key={group.title}>
								{group.columns.length === 0 ? (
									<Link
										href={group.href ?? '/'}
										onClick={onClose}
										aria-current={
											isActive(pathname, group.href ?? '/')
												? 'page'
												: undefined
										}
										className="text-ink-foreground hover:bg-ink-foreground/[0.06] block rounded-md px-2 py-3 text-base font-medium"
									>
										{group.title}
									</Link>
								) : (
									<details className="group rounded-md">
										<summary className="text-ink-foreground hover:bg-ink-foreground/[0.06] flex cursor-pointer list-none items-center justify-between rounded-md px-2 py-3 text-base font-medium [&::-webkit-details-marker]:hidden">
											{group.title}
											<ChevronDown
												className="text-ink-foreground/50 h-4 w-4 transition-transform group-open:rotate-180"
												aria-hidden="true"
											/>
										</summary>
										<div className="pb-2 pl-2">
											{group.columns.map((column) => (
												<div key={column.title} className="mb-2">
													<p className="text-ink-foreground/45 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
														{column.title}
													</p>
													<ul>
														{column.links.map((link) => (
															<li key={`${column.title}-${link.label}-${link.href}`}>
																<Link
																	href={link.href}
																	target={link.external ? '_blank' : undefined}
																	rel={link.external ? 'noreferrer' : undefined}
																	onClick={onClose}
																	className="text-ink-foreground/70 hover:bg-ink-foreground/[0.06] hover:text-ink-foreground block rounded-md px-2 py-2 text-sm"
																>
																	{link.label}
																</Link>
															</li>
														))}
													</ul>
												</div>
											))}
											<Link
												href={group.href ?? '/'}
												onClick={onClose}
												className="text-signal block px-2 py-2 text-sm font-medium"
											>
												View all {group.title.toLowerCase()}
											</Link>
										</div>
									</details>
								)}
							</li>
						))}
					</ul>
				</nav>

				<div className="border-ink-foreground/10 mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
					{utilityNav.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target={link.external ? '_blank' : undefined}
							rel={link.external ? 'noreferrer' : undefined}
							className="border-ink-foreground/20 text-ink-foreground/70 hover:border-ink-foreground/40 hover:text-ink-foreground rounded-full border px-3 py-1.5 text-xs"
						>
							{link.label} {link.external && <span aria-hidden="true">↗</span>}
						</a>
					))}
					<div className="ml-auto flex items-center gap-1">
						<ThemeToggle variant="ghost" />
						<LanguageSelector variant="ghost" />
					</div>
				</div>

				<div className="border-ink-foreground/10 mt-4 grid gap-2 border-t pt-4">
					<Button
						className="bg-brand text-brand-foreground hover:bg-brand/90 rounded-full"
						asChild
					>
						<Link href={cta.primary.href} onClick={onClose}>
							{cta.primary.label}
						</Link>
					</Button>
					<Button
						variant="outline"
						className="border-ink-foreground/25 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground rounded-full bg-transparent"
						asChild
					>
						<Link href={cta.secondary.href} onClick={onClose}>
							{cta.secondary.label}
						</Link>
					</Button>
					<Button
						variant="ghost"
						className="text-ink-foreground/70 hover:bg-ink-foreground/10 hover:text-ink-foreground rounded-full"
						asChild
					>
						<Link href={cta.signIn.href} onClick={onClose}>
							{cta.signIn.label}
						</Link>
					</Button>
				</div>
			</Container>
		</div>
	)
}

export function SiteHeader() {
	const pathname = usePathname()
	const [openMenu, setOpenMenu] = React.useState<string | null>(null)
	const [mobileOpen, setMobileOpen] = React.useState(false)
	const navRef = React.useRef<HTMLDivElement>(null)
	const panelRef = React.useRef<HTMLDivElement>(null)

	React.useEffect(() => {
		setOpenMenu(null)
		setMobileOpen(false)
	}, [pathname])

	React.useEffect(() => {
		function onClick(event: MouseEvent) {
			if (
				openMenu &&
				navRef.current &&
				panelRef.current &&
				!navRef.current.contains(event.target as Node) &&
				!panelRef.current.contains(event.target as Node)
			) {
				setOpenMenu(null)
			}
		}
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') setOpenMenu(null)
		}
		document.addEventListener('mousedown', onClick)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('mousedown', onClick)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [openMenu])

	const openGroup = mainNav.find((group) => group.title === openMenu && group.columns.length > 0)

	return (
		<header
			onMouseLeave={() => setOpenMenu(null)}
			className="border-ink-foreground/10 bg-ink text-ink-foreground dark sticky top-0 z-50 border-b"
		>
			<Container>
				{/* Three distinct zones: identity, navigation, actions. */}
				<div className="grid h-[76px] grid-cols-[auto_1fr_auto] items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
					{/* Zone 1 — identity */}
					<Link
						href="/"
						aria-label="ZenthCloud home"
						className="flex shrink-0 items-center gap-2.5"
					>
						<Logo className="h-6 w-6" />
						<span className="font-display text-[15px] font-semibold uppercase tracking-[0.18em]">
							ZenthCloud
						</span>
					</Link>

					{/* Zone 2 — navigation */}
					<div ref={navRef} className="hidden justify-center lg:flex">
						<nav aria-label="Main">
							<ul className="flex items-center gap-0.5">
								{mainNav.map((group) => (
									<li key={group.title}>
										<DesktopMenu
											group={group}
											open={openMenu === group.title}
											onOpen={() => setOpenMenu(group.title)}
											onClose={() => setOpenMenu(null)}
											pathname={pathname}
										/>
									</li>
								))}
							</ul>
						</nav>
					</div>

					{/* Zone 3 — actions */}
					<div className="ml-auto flex items-center gap-1 justify-self-end">
						<ThemeToggle variant="ghost" className="hidden md:inline-flex" />
						<LanguageSelector variant="ghost" className="hidden sm:block" />
						<Link
							href={cta.signIn.href}
							className="border-ink-foreground/25 text-ink-foreground/85 hover:border-ink-foreground/50 hover:text-ink-foreground ml-2 hidden h-8 items-center whitespace-nowrap rounded-full border px-4 text-[13px] font-medium transition-colors md:inline-flex"
						>
							{cta.signIn.label}
						</Link>
						<Link
							href={cta.secondary.href}
							className="border-ink-foreground/25 text-ink-foreground/85 hover:border-ink-foreground/50 hover:text-ink-foreground hidden h-8 items-center whitespace-nowrap rounded-full border px-4 text-[13px] font-medium transition-colors sm:inline-flex"
						>
							Contact sales
						</Link>
						<SiteSearch entries={searchIndex} variant="icon" />
						<button
							type="button"
							onClick={() => setMobileOpen((value) => !value)}
							aria-expanded={mobileOpen}
							aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
							className="text-ink-foreground/70 hover:bg-ink-foreground/10 hover:text-ink-foreground inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors lg:hidden"
						>
							{mobileOpen ? (
								<X className="h-5 w-5" aria-hidden="true" />
							) : (
								<Menu className="h-5 w-5" aria-hidden="true" />
							)}
						</button>
					</div>
				</div>
			</Container>

			{openGroup && (
				<MegaPanel
					key={openGroup.title}
					group={openGroup}
					onClose={() => setOpenMenu(null)}
					panelRef={panelRef}
				/>
			)}

			<MobileMenu
				open={mobileOpen}
				onClose={() => setMobileOpen(false)}
				pathname={pathname}
			/>
		</header>
	)
}
