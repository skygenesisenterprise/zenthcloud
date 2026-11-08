import { ADVANCED_PROFILES, CATALOG_MODES, ENVIRONMENTS, } from "./contracts/core.js";
import { registerSecret } from "./observability/secrets.js";
import { parseCustomHeaders } from "./utils/clientConfig.js";
import { DEFAULT_REDACTED_FIELDS } from "./utils/redactSensitive.js";
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_TIMEOUT_MS = 120_000;
const DEFAULT_MAX_RESULT_BYTES = 256 * 1024;
export function parseBoolean(value, fallback) {
    if (value === undefined)
        return fallback;
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized))
        return true;
    if (["false", "0", "no", "off", ""].includes(normalized))
        return false;
    return fallback;
}
function parseInteger(name, value, fallback, minimum, maximum) {
    if (value === undefined || value.trim() === "")
        return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
        throw new Error(`Environment variable ${name} must be an integer between ${minimum} and ${maximum}`);
    }
    return parsed;
}
function parseList(value) {
    return (value ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
}
function parseChoice(name, value, choices, fallback) {
    if (value === undefined || value.trim() === "")
        return fallback;
    const normalized = value.trim().toLowerCase();
    if (!choices.includes(normalized)) {
        throw new Error(`Environment variable ${name} must be one of: ${choices.join(", ")} (received "${value}")`);
    }
    return normalized;
}
/**
 * Validates the guilderia base URL.
 *
 * Credentials in the URL, a query string or a fragment are rejected: they
 * would leak into logs or change which endpoint is targeted without being
 * visible in the configuration. Only http(s) is accepted.
 */
export function validateguilderiaUrl(raw) {
    let url;
    try {
        url = new URL(raw);
    }
    catch {
        throw new Error("Environment variable guilderia_URL must be a valid absolute URL");
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Environment variable guilderia_URL must use http:// or https://");
    }
    if (url.username || url.password) {
        throw new Error("Environment variable guilderia_URL must not contain credentials");
    }
    if (url.search || url.hash) {
        throw new Error("Environment variable guilderia_URL must not contain a query string or fragment");
    }
    return `${url.origin}${url.pathname}`.replace(/\/+$/, "");
}
function validateApiKey(raw) {
    const value = raw?.trim();
    if (!value) {
        throw new Error("Environment variable guilderia_API_KEY is not defined");
    }
    if (value.length > 4096) {
        throw new Error("Environment variable guilderia_API_KEY is too long");
    }
    // Reject control characters explicitly: an API key must be a single printable token.
    // biome-ignore lint/suspicious/noControlCharactersInRegex: intentional control-character validation
    if (/[\s\u0000-\u001f\u007f]/.test(value)) {
        throw new Error("Environment variable guilderia_API_KEY must not contain whitespace");
    }
    return value;
}
function loadPolicy(env) {
    const maxAutomaticRisk = parseInteger("guilderia_MCP_MAX_RISK", env.guilderia_MCP_MAX_RISK, 1, 0, 3);
    const approvalToken = env.guilderia_MCP_APPROVAL_TOKEN?.trim() || undefined;
    if (approvalToken !== undefined && approvalToken.length < 16) {
        throw new Error("Environment variable guilderia_MCP_APPROVAL_TOKEN must be at least 16 characters");
    }
    return {
        maxAutomaticRisk,
        allowHighRiskWithApproval: parseBoolean(env.guilderia_MCP_ALLOW_HIGH_RISK, true),
        allowDestructive: parseBoolean(env.guilderia_MCP_ALLOW_DESTRUCTIVE, false),
        ...(approvalToken ? { approvalToken } : {}),
        blockedCapabilities: new Set(parseList(env.guilderia_MCP_BLOCKED_CAPABILITIES)),
    };
}
function loadLimits(env) {
    return {
        toolTimeoutMs: parseInteger("guilderia_MCP_TIMEOUT_MS", env.guilderia_MCP_TIMEOUT_MS, DEFAULT_TIMEOUT_MS, 1_000, MAX_TIMEOUT_MS),
        maxResultBytes: parseInteger("guilderia_MCP_MAX_RESULT_BYTES", env.guilderia_MCP_MAX_RESULT_BYTES, DEFAULT_MAX_RESULT_BYTES, 1_024, 8 * 1024 * 1024),
        maxRequestsPerMinute: parseInteger("guilderia_MCP_RATE_LIMIT", env.guilderia_MCP_RATE_LIMIT, 120, 1, 10_000),
        maxConcurrentRequests: parseInteger("guilderia_MCP_MAX_CONCURRENCY", env.guilderia_MCP_MAX_CONCURRENCY, 4, 1, 64),
        operationRetentionMs: parseInteger("guilderia_MCP_OPERATION_RETENTION_MS", env.guilderia_MCP_OPERATION_RETENTION_MS, 24 * 60 * 60 * 1000, 60_000, 30 * 24 * 60 * 60 * 1000),
        verificationTimeoutMs: parseInteger("guilderia_MCP_VERIFICATION_TIMEOUT_MS", env.guilderia_MCP_VERIFICATION_TIMEOUT_MS, 10 * 60 * 1000, 5_000, 60 * 60 * 1000),
        verificationIntervalMs: parseInteger("guilderia_MCP_VERIFICATION_INTERVAL_MS", env.guilderia_MCP_VERIFICATION_INTERVAL_MS, 5_000, 500, 60_000),
    };
}
function parseOptionalHttpUrl(name, value) {
    const trimmed = value?.trim();
    if (!trimmed)
        return undefined;
    let url;
    try {
        url = new URL(trimmed);
    }
    catch {
        throw new Error(`Environment variable ${name} must be a valid absolute URL`);
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error(`Environment variable ${name} must use http:// or https://`);
    }
    if (url.username || url.password || url.search || url.hash) {
        throw new Error(`Environment variable ${name} must not contain credentials, query string or fragment`);
    }
    return `${url.origin}${url.pathname}`.replace(/\/+$/, "");
}
function loadHttp(env) {
    const token = env.guilderia_MCP_HTTP_TOKEN?.trim() || undefined;
    if (token !== undefined && token.length < 16) {
        throw new Error("Environment variable guilderia_MCP_HTTP_TOKEN must be at least 16 characters");
    }
    return {
        port: parseInteger("MCP_PORT", env.MCP_PORT ?? env.PORT, 3000, 1, 65_535),
        host: env.guilderia_MCP_HTTP_HOST?.trim() || "127.0.0.1",
        ...(token ? { token } : {}),
        allowUnauthenticated: parseBoolean(env.guilderia_MCP_HTTP_ALLOW_UNAUTHENTICATED, false),
        sessionTtlMs: parseInteger("guilderia_MCP_HTTP_SESSION_TTL_MS", env.guilderia_MCP_HTTP_SESSION_TTL_MS, 30 * 60 * 1000, 60_000, 24 * 60 * 60 * 1000),
        maxSessions: parseInteger("guilderia_MCP_HTTP_MAX_SESSIONS", env.guilderia_MCP_HTTP_MAX_SESSIONS, 50, 1, 1_000),
        maxBodyBytes: parseInteger("guilderia_MCP_HTTP_MAX_BODY_BYTES", env.guilderia_MCP_HTTP_MAX_BODY_BYTES, 1024 * 1024, 1_024, 16 * 1024 * 1024),
        ...(parseOptionalHttpUrl("guilderia_MCP_PUBLIC_BASE_URL", env.guilderia_MCP_PUBLIC_BASE_URL)
            ? {
                publicBaseUrl: parseOptionalHttpUrl("guilderia_MCP_PUBLIC_BASE_URL", env.guilderia_MCP_PUBLIC_BASE_URL),
            }
            : {}),
        ...(parseOptionalHttpUrl("guilderia_MCP_OAUTH_ISSUER", env.guilderia_MCP_OAUTH_ISSUER)
            ? {
                oauthIssuer: parseOptionalHttpUrl("guilderia_MCP_OAUTH_ISSUER", env.guilderia_MCP_OAUTH_ISSUER),
            }
            : {}),
        ...(env.guilderia_MCP_OAUTH_AUDIENCE?.trim() || undefined
            ? { oauthAudience: env.guilderia_MCP_OAUTH_AUDIENCE.trim() }
            : {}),
    };
}
function loadMode(env) {
    const legacySelection = {
        ...(env.guilderia_TOOL_PRESET ? { preset: env.guilderia_TOOL_PRESET.trim() } : {}),
        enabledTags: parseList(env.guilderia_ENABLED_TAGS),
        disabledTags: parseList(env.guilderia_DISABLED_TAGS),
    };
    const hasLegacySelection = legacySelection.preset !== undefined ||
        legacySelection.enabledTags.length > 0 ||
        legacySelection.disabledTags.length > 0;
    const explicitMode = env.guilderia_MCP_MODE?.trim();
    const mode = explicitMode
        ? parseChoice("guilderia_MCP_MODE", explicitMode, CATALOG_MODES, "business")
        : hasLegacySelection
            ? "advanced"
            : "business";
    // Legacy presets exposed every generated operation, so they keep the `full`
    // profile. An explicit advanced mode defaults to read-only.
    const profile = parseChoice("guilderia_MCP_ADVANCED_PROFILE", env.guilderia_MCP_ADVANCED_PROFILE, ADVANCED_PROFILES, hasLegacySelection ? "full" : "read-only");
    return {
        mode,
        legacySelection,
        advanced: {
            profile,
            enabledTags: parseList(env.guilderia_MCP_ADVANCED_TAGS),
            disabledTags: parseList(env.guilderia_MCP_ADVANCED_DISABLED_TAGS),
            excludedOperations: parseList(env.guilderia_MCP_ADVANCED_EXCLUDE),
        },
    };
}
export function loadConfig(env = process.env) {
    const rawUrl = env.guilderia_URL;
    if (!rawUrl) {
        throw new Error("Environment variable guilderia_URL is not defined");
    }
    const parsedFields = parseList(env.guilderia_REDACT_FIELDS);
    const { mode, legacySelection, advanced } = loadMode(env);
    const operationStorePath = env.guilderia_MCP_OPERATION_STORE?.trim();
    const auditLogPath = env.guilderia_MCP_AUDIT_LOG?.trim();
    const config = {
        guilderiaUrl: validateguilderiaUrl(rawUrl),
        apiKey: validateApiKey(env.guilderia_API_KEY),
        customHeaders: parseCustomHeaders(env.guilderia_CUSTOM_HEADERS),
        timeoutMs: parseInteger("guilderia_TIMEOUT", env.guilderia_TIMEOUT, DEFAULT_TIMEOUT_MS, 1_000, MAX_TIMEOUT_MS),
        retryAttempts: parseInteger("guilderia_RETRY_ATTEMPTS", env.guilderia_RETRY_ATTEMPTS, 2, 0, 5),
        retryDelayMs: parseInteger("guilderia_RETRY_DELAY", env.guilderia_RETRY_DELAY, 1_000, 100, 30_000),
        redactEnv: parseBoolean(env.guilderia_REDACT_ENV, true),
        redactFields: parsedFields.length > 0 ? parsedFields : DEFAULT_REDACTED_FIELDS,
        environment: parseChoice("guilderia_MCP_ENVIRONMENT", env.guilderia_MCP_ENVIRONMENT, ENVIRONMENTS, "self"),
        mode,
        advanced,
        legacySelection,
        policy: loadPolicy(env),
        limits: loadLimits(env),
        http: loadHttp(env),
        ...(operationStorePath ? { operationStorePath } : {}),
        ...(auditLogPath ? { auditLogPath } : {}),
        logLevel: parseChoice("guilderia_MCP_LOG_LEVEL", env.guilderia_MCP_LOG_LEVEL, ["error", "warn", "info", "debug"], "info"),
    };
    // Register every credential known to this process so logs, errors, audit
    // records and tool outputs can redact literal occurrences defensively.
    registerSecret(config.apiKey);
    registerSecret(config.policy.approvalToken);
    registerSecret(config.http.token);
    for (const value of Object.values(config.customHeaders))
        registerSecret(value);
    return config;
}
let cachedConfig;
export function getConfig() {
    cachedConfig ??= loadConfig();
    return cachedConfig;
}
/** Test helper: clears the memoized configuration. */
export function resetConfig() {
    cachedConfig = undefined;
}
