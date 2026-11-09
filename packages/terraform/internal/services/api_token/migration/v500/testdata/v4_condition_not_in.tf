resource "zenthcloud_api_token" "%[1]s" {
  name = "%[1]s"

  policy {
    permission_groups = [
      "82e64a83756745bbbb1c9c2701bf816b"
    ]
    resources = {
      "com.zenthcloud.api.account.zone.*" = "*"
    }
  }

  condition {
    request_ip {
      not_in = ["192.0.2.0/24"]
    }
  }
}
