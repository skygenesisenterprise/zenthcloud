resource "zenthcloud_api_token" "%[1]s" {
  name = "%[1]s"

  policies = [
    {
      effect = "allow"
      permission_groups = [{
        id = "82e64a83756745bbbb1c9c2701bf816b"
      }]
      resources = jsonencode({
        "com.zenthcloud.api.account.%[2]s" = "*"
      })
    },
    {
      effect = "deny"
      permission_groups = [{
        id = "e199d584e69344eba202452019deafe3"
      }]
      resources = jsonencode({
        "com.zenthcloud.api.account.zone.*" = "*"
      })
    }
  ]
}
