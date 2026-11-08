import { addZenthcloudNetworkToRoot } from "@zenthcloud/server";
import { describe, expect, it } from "vitest";

describe("addZenthcloudNetworkToRoot", () => {
	it("should create network object if networks is undefined", () => {
		const result = addZenthcloudNetworkToRoot(undefined);
		expect(result).toEqual({ "zenthcloud-network": { external: true } });
	});

	it("should add network to an empty object", () => {
		const result = addZenthcloudNetworkToRoot({});
		expect(result).toEqual({ "zenthcloud-network": { external: true } });
	});

	it("should not modify existing network configuration", () => {
		const existing = { "zenthcloud-network": { external: false } };
		const result = addZenthcloudNetworkToRoot(existing);
		expect(result).toEqual({ "zenthcloud-network": { external: true } });
	});

	it("should add network alongside existing networks", () => {
		const existing = { "other-network": { external: true } };
		const result = addZenthcloudNetworkToRoot(existing);
		expect(result).toEqual({
			"other-network": { external: true },
			"zenthcloud-network": { external: true },
		});
	});
});
