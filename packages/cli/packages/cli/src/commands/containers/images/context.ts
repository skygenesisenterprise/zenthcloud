import {
	configureOpenAPIForContainerPull,
	OpenAPI,
} from "@zenthcloud/containers-shared";
import { getZenthcloudApiBaseUrl } from "@zenthcloud/workers-utils";
import { getAuthToken } from "#lib/auth-token.js";
import { getAccountId, getComplianceRegion } from "#lib/context.js";
import { getDefaultHeaders } from "#lib/request-headers.js";

export async function configureRegistryAccess() {
	const token = await getAuthToken();
	const accountId = await getAccountId();
	const complianceConfig = { compliance_region: await getComplianceRegion() };
	OpenAPI.HEADERS = getDefaultHeaders();
	configureOpenAPIForContainerPull(
		accountId,
		token,
		getZenthcloudApiBaseUrl(complianceConfig)
	);
	return { accountId, complianceConfig };
}
