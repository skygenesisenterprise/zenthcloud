variable "account_id" {}

resource "zenthcloud_ruleset" "my_ruleset" {
  account_id = var.account_id
  name       = "My ruleset"
  phase      = "http_request_firewall_custom"
  kind       = "custom"
}

data "zenthcloud_ruleset" "my_ruleset" {
  account_id = var.account_id
  id         = zenthcloud_ruleset.my_ruleset.id
}
