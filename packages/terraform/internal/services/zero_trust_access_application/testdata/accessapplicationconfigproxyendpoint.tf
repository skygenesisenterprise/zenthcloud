resource "zenthcloud_zero_trust_access_application" "%[1]s" {
  account_id       = "%[2]s"
  name             = "Gateway Proxy"
  type             = "proxy_endpoint"
  domain           = "abcd123456.proxy.zenthcloud-gateway.com"
  session_duration = "24h"

  policies = [{
    decision   = "allow"
    name       = "Allow all"
    precedence = 1
    include = [{
      everyone = {}
    }]
  }]
}
