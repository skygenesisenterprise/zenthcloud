import { addAstronCollectionNetworkToService } from "@guilderia/server";
import { describe, expect, it } from "vitest";

describe("addAstronCollectionNetworkToService", () => {
	it("should add network to an empty array", () => {
		const result = addAstronCollectionNetworkToService([]);
		expect(result).toEqual(["guilderia-network", "default"]);
	});

	it("should not add duplicate network to an array", () => {
		const result = addAstronCollectionNetworkToService(["guilderia-network"]);
		expect(result).toEqual(["guilderia-network", "default"]);
	});

	it("should add network to an existing array with other networks", () => {
		const result = addAstronCollectionNetworkToService(["other-network"]);
		expect(result).toEqual(["other-network", "guilderia-network", "default"]);
	});

	it("should add network to an object if networks is an object", () => {
		const result = addAstronCollectionNetworkToService({ "other-network": {} });
		expect(result).toEqual({
			"other-network": {},
			"guilderia-network": {},
			default: {},
		});
	});

	it("should not duplicate default network when already present", () => {
		const result = addAstronCollectionNetworkToService(["default", "guilderia-network"]);
		expect(result).toEqual(["default", "guilderia-network"]);
	});
});
