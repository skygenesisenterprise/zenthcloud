data "zenthcloud_api_token_permission_groups_list" "dns_read" {
  name  = "DNS Read"
  scope = "com.zenthcloud.api.account.zone"
}

resource "zenthcloud_api_token" "test_account_token" {
  name   = "%[1]s"
  status = "active"

  policies = [{
    effect            = "allow"
    permission_groups = [{ id = data.zenthcloud_api_token_permission_groups_list.dns_read.result[0].id }]
    resources         = jsonencode({ "com.zenthcloud.api.account.zone.*" = "*" })
  }]

  not_before = "2018-07-01T05:20:00Z"
  expires_on = "%[2]s"
}
