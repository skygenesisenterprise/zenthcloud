data "zenthcloud_account_api_token_permission_groups_list" "dns_read" {
  account_id = "%[2]s"
  name       = "DNS Read"
  scope      = "com.zenthcloud.api.account.zone"
}

resource "zenthcloud_account_token" "crud_test" {
  account_id = "%[2]s"
  name       = "%[1]s"
  expires_on = "%[3]s"

  policies = [
    {
      effect = "allow"
      permission_groups = [
        { id = data.zenthcloud_account_api_token_permission_groups_list.dns_read.result[0].id }
      ]
      resources = jsonencode({
        "com.zenthcloud.api.account.%[2]s" : {
          "com.zenthcloud.api.account.zone.*" = "*"
        }
      })
    }
  ]

  condition = {
    request_ip = {
      in = ["%[4]s"]
    }
  }
}
