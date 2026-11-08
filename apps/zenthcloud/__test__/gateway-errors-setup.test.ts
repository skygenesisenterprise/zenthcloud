import {
	buildGatewayErrorsEnv,
	getGatewayErrorsImage,
} from "@guilderia/server";
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
			GUILDERIA_GATEWAY_BRAND_NAME: "Acme",
			GUILDERIA_GATEWAY_DOCS_URL: "https://docs.example.com",
			GUILDERIA_GATEWAY_STATUS_URL: "https://status.example.com",
			GUILDERIA_GATEWAY_SUPPORT_URL: "javascript:alert(1)",
			GUILDERIA_GATEWAY_LOCALE: "fr",
			IS_CLOUD: "true",
		});

		expect(env).toContain("GUILDERIA_GATEWAY_BRAND_NAME=Acme");
		expect(env).toContain(
			"GUILDERIA_GATEWAY_DOCS_URL=https://docs.example.com/",
		);
		expect(env).toContain(
			"GUILDERIA_GATEWAY_STATUS_URL=https://status.example.com/",
		);
		expect(env).toContain("GUILDERIA_GATEWAY_LOCALE=fr");
		expect(env).toContain("GUILDERIA_GATEWAY_PORT=8080");
		expect(env).toContain("IS_CLOUD=true");
		expect(env.some((value) => value.startsWith("GUILDERIA_GATEWAY_SUPPORT_URL="))).toBe(
			false,
		);
	});

	test("uses safe defaults when no overrides are present", () => {
		const env = buildGatewayErrorsEnv({});
		expect(env).toContain("GUILDERIA_GATEWAY_BRAND_NAME=Guilderia");
		expect(env).toContain("GUILDERIA_GATEWAY_LOCALE=en");
		expect(env).toContain("IS_CLOUD=false");
	});
});

describe("getGatewayErrorsImage", () => {
	test("prefers the explicit sidecar image", async () => {
		const image = await getGatewayErrorsImage(
			dockerWithImage("ignored:latest"),
			undefined,
			{ GUILDERIA_GATEWAY_ERRORS_IMAGE: "node:24-alpine" },
		);
		expect(image).toBe("node:24-alpine");
	});

	test("reuses the running control-plane image", async () => {
		const image = await getGatewayErrorsImage(
			dockerWithImage("guilderia:local"),
			undefined,
			{},
		);
		expect(image).toBe("guilderia:local");
	});

	test("builds the image from GUILDERIA_IMAGE and GUILDERIA_VERSION", async () => {
		const image = await getGatewayErrorsImage(
			dockerWithImage("guilderia:local"),
			"server-1",
			{
				GUILDERIA_IMAGE: "ghcr.io/example/guilderia",
				GUILDERIA_VERSION: "v1.2.3",
			},
		);
		expect(image).toBe("ghcr.io/example/guilderia:v1.2.3");
	});

	test("does not append a tag to an image that already has one", async () => {
		const image = await getGatewayErrorsImage(
			dockerWithImage("guilderia:local"),
			"server-1",
			{ GUILDERIA_IMAGE: "ghcr.io/example/guilderia:canary" },
		);
		expect(image).toBe("ghcr.io/example/guilderia:canary");
	});
});
