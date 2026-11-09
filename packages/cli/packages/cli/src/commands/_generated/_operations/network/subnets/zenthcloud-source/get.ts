/** @generated from network.subnets.zenthcloud-source.get */
import { path } from "#api";

export default {
	method: "GET",
	path: (request: Record<string, unknown>) =>
		path`/accounts/${request.account_id}/zerotrust/subnets/zenthcloud_source/${request.address_family}`,
} as const;
