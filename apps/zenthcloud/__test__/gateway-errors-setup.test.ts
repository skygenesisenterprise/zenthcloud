import {
	buildGatewayErrorsEnv,
	getGatewayErrorsImage,
} from "@zenthcloud/server";
import { describe, expect, test } from "vitest";

const dockerWithImage = (image: string) =>
	({
		getContainer: () => ({
			inspect: async () => ({ Config: { Image: image } }),
		}),
	}) as unknown as Parameters<typeof getGatewayErrorsImage>[0];

describe("buildGatewayErrorsEnv", () => {
	test("passes the validated page configuration to the sidecar", () => {
		const env = buildGatewayErrorsEnv({
			ZENTHCLOUD_GATEWAY_BRAND_NAME: "Acme",
			ZENTHCLOUD_GATEWAY_DOCS_URL: "https://docs.example.com",
			ZENTHCLOUD_GATEWAY_STATUS_URL: "https://status.example.com",
			ZENTHCLOUD_GATEWAY_SUPPORT_URL: "javascript:alert(1)",
			ZENTHCLOUD_GATEWAY_LOCALE: "fr",
			IS_CLOUD: "true",
		});

		expect(env).toContain("ZENTHCLOUD_GATEWAY_BRAND_NAME=Acme");
		expect(env).toContain(
			"ZENTHCLOUD_GATEWAY_DOCS_URL=https://docs.example.com/",
		);
		expect(env).toContain(
			"ZENTHCLOUD_GATEWAY_STATUS_URL=https://status.example.com/",
		);
		expect(env).toContain("ZENTHCLOUD_GATEWAY_LOCALE=fr");
		expect(env).toContain("ZENTHCLOUD_GATEWAY_PORT=8080");
		expect(env).toContain("IS_CLOUD=true");
		expect(env.some((value) => value.startsWith("ZENTHCLOUD_GATEWAY_SUPPORT_URL="))).toBe(
			false,
		);
	});

	test("uses safe defaults when no overrides are present", () => {
		const env = buildGatewayErrorsEnv({});
		expect(env).toContain("ZENTHCLOUD_GATEWAY_BRAND_NAME=Zenthcloud");
		expect(env).toContain("ZENTHCLOUD_GATEWAY_LOCALE=en");
		expect(env).toContain("IS_CLOUD=false");
	});
});

describe("getGatewayErrorsImage", () => {
	test("prefers the explicit sidecar image", async () => {
		const image = await getGatewayErrorsImage(
			dockerWithImage("ignored:latest"),
			undefined,
			{ ZENTHCLOUD_GATEWAY_ERRORS_IMAGE: "node:24-alpine" },
		);
		expect(image).toBe("node:24-alpine");
	});

	test("reuses the running control-plane image", async () => {
		const image = await getGatewayErrorsImage(
			dockerWithImage("zenthcloud:local"),
			undefined,
			{},
		);
		expect(image).toBe("zenthcloud:local");
	});

	test("builds the image from ZENTHCLOUD_IMAGE and ZENTHCLOUD_VERSION", async () => {
		const image = await getGatewayErrorsImage(
			dockerWithImage("zenthcloud:local"),
			"server-1",
			{
				ZENTHCLOUD_IMAGE: "ghcr.io/example/zenthcloud",
				ZENTHCLOUD_VERSION: "v1.2.3",
			},
		);
		expect(image).toBe("ghcr.io/example/zenthcloud:v1.2.3");
	});

	test("does not append a tag to an image that already has one", async () => {
		const image = await getGatewayErrorsImage(
			dockerWithImage("zenthcloud:local"),
			"server-1",
			{ ZENTHCLOUD_IMAGE: "ghcr.io/example/zenthcloud:canary" },
		);
		expect(image).toBe("ghcr.io/example/zenthcloud:canary");
	});
});
