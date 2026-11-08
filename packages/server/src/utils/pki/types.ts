/**
 * Zenthcloud Instance Identity & Certificate Authority — domain model.
 *
 * This module is intentionally separate from:
 *  - `utils/tls/certificate` (application TLS certificates served by Traefik), and
 *  - `utils/identity` (human/IdP identity providers: OIDC, SAML, LDAP).
 *
 * It answers the two distinct questions of issue #75:
 *  - **Identity** — *who is this Zenthcloud instance?* → a locally generated key
 *    pair and its X.509 certificate.
 *  - **Entitlement** — *what is it authorized to use?* → a Zenthcloud-signed token
 *    that grants a product and its capabilities.
 *
 * Identity is not licensing: a valid certificate never by itself grants a
 * capability, and a capability never authenticates an instance.
 */

/**
 * Zenthcloud distribution/flavor running on the host.
 *
 * `self` is free and autonomous: it bootstraps a local trust anchor and needs no
 * contact with Zenthcloud services. `cloud` and `console` are protected products
 * that require a Zenthcloud-signed entitlement.
 */
export const zenthcloudProducts = ["self", "cloud", "console"] as const;
export type ZenthcloudProduct = (typeof zenthcloudProducts)[number];

export const zenthcloudProductLabels: Record<ZenthcloudProduct, string> = {
	self: "Self-hosted",
	cloud: "Zenthcloud Cloud",
	console: "Zenthcloud Console",
};

/**
 * Capability ids, namespaced by product. Centrally evaluated by the application
 * instead of scattered `IS_CLOUD` / proprietary checks.
 *
 * Ids are dot-namespaced so `installation.hasCapability("cloud.fleet")` reads
 * naturally. The set is closed and validated: an unknown capability is never
 * trusted because it arrived in a token.
 */
export const zenthcloudCapabilities = [
	"self.hosted",
	"self.local-registry",
	"self.offline",
	"cloud.control-plane",
	"cloud.managed-services",
	"cloud.fleet",
	"console.instance-management",
	"console.fleet",
	"console.remote-management",
] as const;
export type ZenthcloudCapability = (typeof zenthcloudCapabilities)[number];

/** Capabilities granted by default to each product. */
export const productCapabilities: Record<
	ZenthcloudProduct,
	readonly ZenthcloudCapability[]
> = {
	self: ["self.hosted", "self.local-registry", "self.offline"],
	cloud: ["cloud.control-plane", "cloud.managed-services", "cloud.fleet"],
	console: [
		"console.instance-management",
		"console.fleet",
		"console.remote-management",
	],
};

/**
 * Products that must present a Zenthcloud-signed entitlement. `self` is deliberately
 * absent: self-hosted must keep working with no online dependency.
 */
export const protectedProducts: readonly ZenthcloudProduct[] = [
	"cloud",
	"console",
];

export const isZenthcloudProduct = (value: string): value is ZenthcloudProduct =>
	(zenthcloudProducts as readonly string[]).includes(value);

export const isZenthcloudCapability = (
	value: string,
): value is ZenthcloudCapability =>
	(zenthcloudCapabilities as readonly string[]).includes(value);

/**
 * Private-extension OID carrying the instance identity document in the X.509
 * certificate. The pen is a placeholder until Zenthcloud's IANA PEN is assigned;
 * it only has to stay stable for the lifetime of issued certificates.
 */
export const ZENTHCLOUD_IDENTITY_EXTENSION_OID = "1.3.6.1.4.1.99999.1.1";

/** Version of the instance identity extension payload. */
export const INSTANCE_IDENTITY_EXTENSION_VERSION = 1;

/**
 * Trust anchor a certificate chains to.
 *  - `local` — the instance's own self-signed CA (self-hosted).
 *  - `zenthcloud` — a Zenthcloud-issued CA (cloud/console, managed servers).
 */
export type TrustAnchorKind = "local" | "zenthcloud";

/**
 * Payload embedded in the instance certificate extension. It is *self-asserted
 * identity metadata* (signed by the local CA), not an authorization: the
 * authoritative entitlement travels in a separate Zenthcloud-signed token.
 */
export interface InstanceIdentityDocument {
	version: number;
	/** Stable random identifier of this installation. */
	instanceId: string;
	/** Product the instance was bootstrapped as. */
	product: ZenthcloudProduct;
	/** Capabilities the instance believes it is entitled to. */
	capabilities: ZenthcloudCapability[];
	/** SHA-256 fingerprint (hex) of the instance public key. */
	subjectKeyFingerprint: string;
	/** ISO-8601 creation timestamp. */
	createdAt: string;
}

/** Public metadata extracted from an instance certificate. */
export interface InstanceCertificateInfo {
	instanceId: string;
	product: ZenthcloudProduct;
	capabilities: ZenthcloudCapability[];
	subjectKeyFingerprint: string;
	createdAt: string;
	serialNumber: string;
	/** SHA-256 fingerprint (colon-separated hex) of the certificate DER. */
	fingerprint: string;
	subjectCommonName: string | null;
	issuerCommonName: string | null;
	notBefore: Date;
	notAfter: Date;
}

/** Lifecycle state of an installation identity, as shown in diagnostics. */
export type InstanceIdentityStatus =
	| "unprovisioned"
	| "active"
	| "expiring"
	| "expired"
	| "invalid"
	| "revoked";

/** Days of remaining validity below which an identity is reported as expiring. */
export const INSTANCE_IDENTITY_EXPIRING_DAYS = 30;

export type IdentityDiagnosticSeverity = "ok" | "warning" | "error";

/** Stable machine-readable diagnostic codes, safe to surface to operators. */
export type IdentityDiagnosticCode =
	| "identity.provisioned"
	| "identity.missing"
	| "identity.unreadable"
	| "identity.certificate_invalid"
	| "identity.chain_invalid"
	| "identity.key_mismatch"
	| "identity.expiring"
	| "identity.expired"
	| "identity.revoked"
	| "entitlement.missing"
	| "entitlement.invalid"
	| "entitlement.expired"
	| "entitlement.mismatch"
	| "entitlement.capabilities_partial";

/**
 * A single verification outcome. Never throws: an invalid identity produces a
 * clear diagnostic rather than an opaque startup failure (issue #75 §6).
 */
export interface IdentityDiagnostic {
	code: IdentityDiagnosticCode;
	severity: IdentityDiagnosticSeverity;
	message: string;
	/** What the operator has to do to resolve the situation, when applicable. */
	remediation: string | null;
}

/** Public, secret-free description of an installation identity. */
export interface InstanceIdentity {
	instanceId: string;
	product: ZenthcloudProduct;
	capabilities: ZenthcloudCapability[];
	status: InstanceIdentityStatus;
	trustAnchor: TrustAnchorKind;
	createdAt: string;
	expiresAt: string;
	daysUntilExpiration: number;
	certificate: InstanceCertificateInfo;
	/** Effective capabilities after entitlement evaluation. */
	diagnostics: IdentityDiagnostic[];
}

/**
 * A signed authorization that answers "what are you authorized to use?".
 * Produced by Zenthcloud's entitlement issuing authority and verified locally with
 * its public key. It is bound to the instance public key so it cannot be copied
 * to another instance.
 */
export interface EntitlementPayload {
	version: number;
	instanceId: string;
	product: ZenthcloudProduct;
	capabilities: ZenthcloudCapability[];
	/** SHA-256 fingerprint (hex) of the instance public key. */
	subjectKeyFingerprint: string;
	issuedAt: string;
	expiresAt: string | null;
	/** Human-readable issuer, for diagnostics. */
	issuer: string;
}

/** Result of verifying an entitlement token. */
export type EntitlementVerification =
	| { valid: true; payload: EntitlementPayload }
	| { valid: false; reason: string };

export const TRUST_ANCHOR_LABELS: Record<TrustAnchorKind, string> = {
	local: "Local instance CA",
	"zenthcloud": "Zenthcloud issuing CA",
};

export const INSTANCE_IDENTITY_STATUS_LABELS: Record<
	InstanceIdentityStatus,
	string
> = {
	unprovisioned: "Not provisioned",
	active: "Active",
	expiring: "Expiring soon",
	expired: "Expired",
	invalid: "Invalid",
	revoked: "Revoked",
};
