import { describe, expect, it } from "vitest";
import {
	CLOUD_DESTINATION_MIN_LICENSE,
	createNavigation,
	findActiveNavigation,
	isNavigationItemActive,
	organizationPath,
	resolveContextualNavigation,
	type PanelNavigation,
	type PanelNavigationItem,
} from "@/components/panel/navigation";

const ORG = "a6369a86743b73f5e58185a5e3b43a1b";
const OTHER_ORG = "f3dd4410d9bcf95499d55f6d569b87e5";

const ALL_PERMISSIONS = {
	dnsProvider: { read: true },
	traffic: { read: true },
};

function create(
	options: Partial<Parameters<typeof createNavigation>[0]> = {},
): PanelNavigation {
	return createNavigation({
		organizationId: ORG,
		environment: "cloud",
		permissions: ALL_PERMISSIONS,
		license: "enterprise",
		...options,
	});
}

function items(navigation: PanelNavigation): PanelNavigationItem[] {
	return navigation.sections.flatMap((section) => section.items);
}

function ids(navigation: PanelNavigation): string[] {
	return items(navigation).map((item) => item.id);
}

describe("panel navigation structure", () => {
	it("renders the requested sections in order", () => {
		const navigation = create();

		expect(navigation.sections.map((section) => section.id)).toEqual([
			"main",
			"build",
			"protect",
		]);
		expect(navigation.sections.map((section) => section.label)).toEqual([
			undefined,
			"Build",
			"Protéger & connecter",
		]);
	});

	it("renders the primary group without a heading", () => {
		const main = create().sections[0];

		expect(main?.id).toBe("main");
		expect(main?.label).toBeUndefined();
		expect(main?.items.map((item) => item.id)).toEqual([
			"home",
			"history",
			"domains",
			"observability",
		]);
	});

	it("keeps Gérer le compte out of the section tree as a utility entry", () => {
		const navigation = create();

		expect(navigation.footer.map((item) => item.id)).toEqual(["account"]);
		expect(navigation.footer[0]?.label).toBe("Gérer le compte");
		expect(navigation.footer[0]?.expandable).toBe(true);
		expect(
			navigation.sections
				.flatMap((section) => section.items)
				.map((item) => item.id),
		).not.toContain("account");
	});

	it("declares every destination of the panel", () => {
		expect(ids(create())).toEqual([
			"home",
			"history",
			"domains",
			"observability",
			"compute",
			"ai",
			"storage",
			"media",
			"realtime",
			"development",
			"applicationSecurity",
			"zeroTrust",
			"networks",
			"threats",
			"monetize",
			"delivery",
		]);
	});

	it("uses stable ids without duplicates", () => {
		const navigationIds = ids(create());

		expect(new Set(navigationIds).size).toBe(navigationIds.length);
	});
});

describe("panel navigation organization scope", () => {
	it("builds every href from the organization in the URL", () => {
		for (const item of items(create())) {
			expect(item.href.startsWith(`/${ORG}/`)).toBe(true);
		}
	});

	it("moves every destination when the organization changes", () => {
		const first = create({ organizationId: ORG });
		const second = create({ organizationId: OTHER_ORG });

		expect(items(first).map((item) => item.href)).not.toEqual(
			items(second).map((item) => item.href),
		);
		for (const item of items(second)) {
			expect(item.href.startsWith(`/${OTHER_ORG}/`)).toBe(true);
		}
	});

	it("encodes the organization and path segments exactly once", () => {
		expect(organizationPath(ORG, "home")).toBe(`/${ORG}/home`);
		expect(organizationPath(ORG, "security/zero-trust")).toBe(
			`/${ORG}/security/zero-trust`,
		);
	});

	it("only links to destinations whose page exists", () => {
		const implemented = items(create()).filter((item) => item.implemented);

		expect(implemented.map((item) => item.id)).toEqual(["home"]);
		expect(implemented[0]?.href).toBe(`/${ORG}/home`);
	});

	it("keeps the whole tree without dead links", () => {
		for (const item of items(create())) {
			if (item.implemented) continue;
			expect(item.href.startsWith(`/${ORG}/`)).toBe(true);
			expect(item.href).not.toBe(`/${ORG}/home`);
		}
	});

	it("marks every destination except the home as expandable", () => {
		const navigation = create();
		// `account` is pinned to the footer, outside the scrollable tree.
		const expandable = [...items(navigation), ...navigation.footer]
			.filter((item) => item.expandable)
			.map((item) => item.id);

		expect(expandable).not.toContain("home");
		expect(expandable).toEqual(
			expect.arrayContaining(["history", "domains", "observability", "account"]),
		);
	});

	it("carries the novelty badges of the panel", () => {
		const badged = items(create())
			.filter((item) => item.badge)
			.map((item) => item.id);

		expect(badged).toEqual(["observability", "monetize"]);
		expect(items(create()).find((item) => item.id === "observability")?.badge).toBe(
			"Nouveau",
		);
	});
});

describe("panel navigation active entry", () => {
	it("selects Accueil on the workspace home", () => {
		const navigation = create();
		const active = findActiveNavigation(navigation, {
			pathname: `/${ORG}/home`,
		});

		expect(active?.section.id).toBe("main");
		expect(active?.item.id).toBe("home");
	});

	it("keeps Accueil selected on nested workspace pages", () => {
		const home = items(create()).find((item) => item.id === "home");

		expect(
			home && isNavigationItemActive(home, { pathname: `/${ORG}/home/` }),
		).toBe(true);
		expect(
			home && isNavigationItemActive(home, { pathname: `/${ORG}/home/stats` }),
		).toBe(true);
	});

	it("does not select Accueil for another organization's route", () => {
		const home = items(create()).find((item) => item.id === "home");

		expect(
			home && isNavigationItemActive(home, { pathname: `/${OTHER_ORG}/home` }),
		).toBe(false);
		expect(
			findActiveNavigation(create(), { pathname: `/${OTHER_ORG}/home` }),
		).toBeUndefined();
	});

	it("does not treat a longer sibling path as a prefix match", () => {
		const home = items(create()).find((item) => item.id === "home");

		expect(
			home && isNavigationItemActive(home, { pathname: `/${ORG}/homestead` }),
		).toBe(false);
	});
});

describe("panel navigation permissions", () => {
	it("hides destinations whose permission is missing", () => {
		const navigation = create({ permissions: {} });
		const navigationIds = ids(navigation);

		expect(navigationIds).not.toContain("domains");
		expect(navigationIds).not.toContain("observability");
		expect(navigationIds).toContain("home");
		expect(navigation.footer.map((item) => item.id)).toEqual(["account"]);
	});

	it("shows destinations granted by the permission map", () => {
		const navigation = create({
			permissions: { dnsProvider: { read: true }, traffic: { read: false } },
		});
		const navigationIds = ids(navigation);

		expect(navigationIds).toContain("domains");
		expect(navigationIds).not.toContain("observability");
	});

	it("treats an unknown permission map as no permissions", () => {
		expect(ids(create({ permissions: undefined }))).not.toContain("domains");
	});
});

describe("panel navigation licences", () => {
	it("never gates a self-hosted workspace", () => {
		const unlicensed = ids(create({ environment: "self", license: null }));
		const enterprise = ids(create({ environment: "self", license: "enterprise" }));

		expect(unlicensed).toEqual(enterprise);
		expect(unlicensed).toContain("zeroTrust");
	});

	it("expands the Cloud menu with the licence tier", () => {
		const free = ids(create({ environment: "cloud", license: "free" }));
		const pro = ids(create({ environment: "cloud", license: "pro" }));
		const enterprise = ids(
			create({ environment: "cloud", license: "enterprise" }),
		);

		expect(free).not.toContain("storage");
		expect(free).not.toContain("zeroTrust");
		expect(pro).toContain("storage");
		expect(pro).not.toContain("zeroTrust");
		expect(enterprise).toContain("storage");
		expect(enterprise).toContain("zeroTrust");
	});

	it("treats an unlicensed Cloud workspace as Free", () => {
		expect(ids(create({ license: null }))).toEqual(
			ids(create({ license: "free" })),
		);
	});

	it("declares an entitlement for every destination", () => {
		const declared = Object.keys(CLOUD_DESTINATION_MIN_LICENSE);

		expect(new Set(declared).size).toBe(declared.length);
		expect(declared).toEqual(
			expect.arrayContaining([
				"home",
				"domains",
				"storage",
				"zeroTrust",
				"account",
			]),
		);
	});
});

describe("panel contextual navigation", () => {
	it("adds the domain destinations under the workspace tree", () => {
		const section = resolveContextualNavigation({
			organizationId: ORG,
			resource: { kind: "domain", id: "dom_123" },
		});

		expect(section.id).toBe("contextual-domain");
		expect(section.label).toBe("Domaine");
		expect(section.items.map((item) => item.label)).toEqual([
			"Vue d'ensemble",
			"DNS",
			"SSL/TLS",
			"Enregistrements",
			"Analytics",
		]);
		expect(section.items.map((item) => item.href)).toEqual([
			`/${ORG}/domains/dom_123/overview`,
			`/${ORG}/domains/dom_123/dns`,
			`/${ORG}/domains/dom_123/ssl`,
			`/${ORG}/domains/dom_123/records`,
			`/${ORG}/domains/dom_123/analytics`,
		]);
	});

	it("prepares instance and bucket environments without linking a missing page", () => {
		const instance = resolveContextualNavigation({
			organizationId: ORG,
			resource: { kind: "instance", id: "inst_1" },
		});
		const bucket = resolveContextualNavigation({
			organizationId: ORG,
			resource: { kind: "bucket", id: "bkt_1" },
		});

		expect(instance.items.map((item) => item.label)).toEqual([
			"Vue d'ensemble",
			"Monitoring",
			"Configuration",
			"Réseau",
			"Stockage",
			"Activité",
		]);
		expect(bucket.items.map((item) => item.label)).toEqual([
			"Vue d'ensemble",
			"Objets",
			"Accès",
			"Lifecycle",
			"Monitoring",
		]);
		for (const item of [...instance.items, ...bucket.items]) {
			expect(item.implemented).toBe(false);
		}
	});
});
