/** @generated from precursor.update */
import { path } from "#api";

export default {
	method: "PUT",
	path: (request: Record<string, unknown>) =>
		path`/zones/${request.zone_id}/precursor`,
	headers: ["Zenthcloud-Version"],
	body: "json",
} as const;
