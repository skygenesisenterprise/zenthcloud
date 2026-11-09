resource "zenthcloud_zero_trust_list" "%[1]s" {
	account_id  = "%[2]s"
	name        = "%[1]s"
	description = "Domain list for testing"
	type        = "DOMAIN"
	items = [
		{ value = "example.com" },
		{ value = "test.com", description = "Test domain" },
		{ value = "zenthcloud.com", description = "Main domain" }
	]
}