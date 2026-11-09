resource "zenthcloud_api_token" "%[1]s" {
  name = "%[1]s"
  status = "active"

  policies = [{
    effect = "allow"
    permission_groups = [{
      id = "%[2]s"
    }]
    resources = jsonencode({
      "com.zenthcloud.api.account.zone.*" = "*"
    })
  }]
}

data "zenthcloud_api_token" "%[1]s" {
  token_id = zenthcloud_api_token.%[1]s.id
  depends_on = [zenthcloud_api_token.%[1]s]
}