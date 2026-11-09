resource "zenthcloud_api_token" "%[1]s" {
  name   = "%[1]s-service-token"
  status = "active"
  policies = [{
    effect = "allow"
    permission_groups = [
      { id = "9e9b428a0bcd46fd80e580b46a69963c" },
      { id = "bf7481a1826f439697cb59a20b22293e" }
    ]
    resources = jsonencode({
      "com.zenthcloud.api.account.%[2]s" = "*"
    })
  }]
}

resource "zenthcloud_ai_search_token" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
  cf_api_id  = zenthcloud_api_token.%[1]s.id
  cf_api_key = zenthcloud_api_token.%[1]s.value
}
