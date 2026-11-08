import { addZenthcloudNetworkToService } from "@zenthcloud/server";
import { describe, expect, it } from "vitest";

describe("addZenthcloudNetworkToService", () => {
	it("should add network to an empty array", () => {
		const result = addZenthcloudNetworkToService([]);
		expect(result).toEqual(["zenthcloud-network", "default"]);
	});

	it("should not add duplicate network to an array", () => {
		const result = addZenthcloudNetworkToService(["zenthcloud-network"]);
		expect(result).toEqual(["zenthcloud-network", "default"]);
	});

	it("should add network to an existing array with other networks", () => {
		const result = addZenthcloudNetworkToService(["other-network"]);
		expect(result).toEqual(["other-network", "zenthcloud-network", "default"]);
	});

	it("should add network to an object if networks is an object", () => {
		const result = addZenthcloudNetworkToService({ "other-network": {} });
		expect(result).toEqual({
			"other-network": {},
			"zenthcloud-network": {},
			default: {},
		});
	});

	it("should not duplicate default network when already present", () => {
		const result = addZenthcloudNetworkToService(["default", "zenthcloud-network"]);
		expect(result).toEqual(["default", "zenthcloud-network"]);
	});
});
