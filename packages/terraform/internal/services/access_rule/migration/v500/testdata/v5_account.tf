resource "zenthcloud_access_rule" "%s" {
  account_id = "%s"
  mode       = "challenge"

  configuration = {
    target = "ip"
    value  = "%s"
  }
}
