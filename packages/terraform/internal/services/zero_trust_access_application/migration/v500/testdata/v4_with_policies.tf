resource "zenthcloud_access_policy" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s-policy"
  decision   = "allow"
  include {
    everyone = true
  }
}

resource "zenthcloud_access_application" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
  domain     = "%[1]s.%[3]s"
  type       = "self_hosted"
  session_duration = "24h"

  policies = [zenthcloud_access_policy.%[1]s.id]
}
