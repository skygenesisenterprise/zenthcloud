resource "zenthcloud_zero_trust_list" "%[1]s" {
	account_id  = "%[2]s"
	name        = "%[1]s"
	description = "URL list for testing"
	type        = "URL"
	items = [
		{ value = "https://example.com/path" },
		{ value = "https://test.com", description = "Test URL" },
		{ value = "https://github.com/skygenesisenterprise/zenthcloud", description = "API URL" }
	]
}