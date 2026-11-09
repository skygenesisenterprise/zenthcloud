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

  condition = {
    request_ip = {
      in = ["192.0.2.1/32"]
    }
  }
}
