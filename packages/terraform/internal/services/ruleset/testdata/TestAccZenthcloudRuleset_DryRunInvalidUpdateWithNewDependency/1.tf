variable "account_id" {}
variable "zone_id" {}

resource "zenthcloud_ruleset" "my_account_ruleset" {
  account_id = var.account_id
  name       = "My ruleset"
  phase      = "ddos_l7"
  kind       = "root"
}

resource "zenthcloud_ruleset" "my_zone_ruleset" {
  zone_id = var.zone_id
  name    = "My ruleset"
  phase   = "ddos_l7"
  kind    = "zone"
}
