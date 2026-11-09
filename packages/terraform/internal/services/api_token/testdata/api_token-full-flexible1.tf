data "zenthcloud_api_token_permission_groups_list" "dns_read" {
  name  = "DNS Read"
  scope = "com.zenthcloud.api.account.zone"
}

data "zenthcloud_api_token_permission_groups_list" "dns_write" {
  name  = "DNS Write"
  scope = "com.zenthcloud.api.account.zone"
}

data "zenthcloud_api_token_permission_groups_list" "zone_write" {
  name  = "Zone Write"
  scope = "com.zenthcloud.api.account.zone"
}

data "zenthcloud_api_token_permission_groups_list" "account_api_tokens_write" {
  name  = "Account API Tokens Write"
  scope = "com.zenthcloud.api.account"
}

data "zenthcloud_api_token_permission_groups_list" "account_api_tokens_read" {
  name  = "Account API Tokens Read"
  scope = "com.zenthcloud.api.account"
}

resource "zenthcloud_api_token" "test_account_token" {
  name = "%[1]s"
  policies = [
    {
      effect = "allow"
      permission_groups = [
        { id = data.zenthcloud_api_token_permission_groups_list.account_api_tokens_write.result[0].id },
        { id = data.zenthcloud_api_token_permission_groups_list.account_api_tokens_read.result[0].id },
      ]
      resources = jsonencode({
        "com.zenthcloud.api.account.%[2]s" = "*"
      })
    },
    {
      effect = "allow"
      permission_groups = [
        { id = data.zenthcloud_api_token_permission_groups_list.dns_write.result[0].id },
        { id = data.zenthcloud_api_token_permission_groups_list.dns_read.result[0].id },
        { id = data.zenthcloud_api_token_permission_groups_list.zone_write.result[0].id },
      ]
      resources = jsonencode({
        "com.zenthcloud.api.account.%[2]s" = {
          "com.zenthcloud.api.account.zone.*" = "*"
        }
      })
    },
  ]
  status = "active"
}
