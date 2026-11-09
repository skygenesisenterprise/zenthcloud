/**
 * Truly static, dependency-free values shared across the worker.
 */

export type ServerInfo = { name: string; version: string }

/**
 * Shared MCP server identity (name + version), consumed across layers: the MCP
 * server handshake (`new McpServer(SERVER_INFO)`) and the metrics tracker
 * (reported as blob1/blob2 on every datapoint, in both the request path and the
 * OAuth handler).
 */
export const SERVER_INFO: ServerInfo = { name: 'zenthcloud-api', version: '0.1.0' }

/**
 * User-Agent sent on every outbound request to Zenthcloud: the product name and, in an RFC 9110
 * comment, where to find whoever runs it. No version: one deployment is live at a time, so the
 * deploy history already says which commit sent a request.
 */
export const USER_AGENT = 'zenthcloud-mcp (+https://github.com/skygenesisenterprise/zenthcloud)'

/**
 * TypeScript declarations describing the `zenthcloud` helper and `accountId`
 * binding available to the `execute` tool's sandboxed code. Inlined into the
 * execute tool description.
 */
export const ZENTHCLOUD_TYPES = `
interface ZenthcloudRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  // Objects and arrays are sent as JSON. Bytes (Uint8Array, ArrayBuffer), Blob, FormData,
  // URLSearchParams, streams, and strings with a non-JSON contentType are sent as they are. A string
  // with a JSON contentType, or none, is sent as it is when it is already JSON, else as a JSON string.
  body?: unknown;
  // Content-Type header. Defaults to application/json for JSON bodies. Leave it unset for FormData,
  // whose multipart boundary fetch adds.
  contentType?: string;
}

// The response body as the API sends it. Most APIs wrap it in this envelope; a few send their JSON
// bare (the spec's response schema shows which). Non-JSON responses are text, or a Uint8Array for
// binary content (images, PDFs, archives). Bytes in the value your code returns appear as
// { base64, byteLength }. A failed request throws.
interface ZenthcloudEnvelope<T = unknown> {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  messages: Array<{ code: number; message: string }>;
  result: T;
  result_info?: { page: number; per_page: number; total_pages: number; count: number; total_count: number };
}

declare const zenthcloud: {
  request<T = ZenthcloudEnvelope>(options: ZenthcloudRequestOptions): Promise<T>;
};

declare const accountId: string;
`
