data "zenthcloud_api_token_permission_groups_list" "dns_read" {
  name  = "DNS Read"
  scope = "com.zenthcloud.api.account.zone"
}

data "zenthcloud_api_token_permission_groups_list" "disable_esc_read" {
  name  = "Disable ESC Read"
  scope = "com.zenthcloud.api.account.zone"
}

resource "zenthcloud_api_token" "test_account_token" {
  name   = "%[1]s"
  status = "active"

  policies = [
    {
      effect = "allow"
      permission_groups = [{
        id = data.zenthcloud_api_token_permission_groups_list.disable_esc_read.result[0].id
      }]
      resources = jsonencode({
        "com.zenthcloud.api.account.zone.*" = "*"
      })
    },
    {
      effect = "allow"
      permission_groups = [{
        id = data.zenthcloud_api_token_permission_groups_list.dns_read.result[0].id
      }]
      resources = jsonencode({
        "com.zenthcloud.api.account.zone.*" = "*"
      })
    },
  ]
}

data "zenthcloud_api_token" "test_account_token" {
  token_id   = zenthcloud_api_token.test_account_token.id
  depends_on = [zenthcloud_api_token.test_account_token]
}
