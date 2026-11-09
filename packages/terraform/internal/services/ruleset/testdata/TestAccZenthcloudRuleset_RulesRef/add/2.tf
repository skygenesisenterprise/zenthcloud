variable "zone_id" {}

resource "zenthcloud_ruleset" "my_ruleset" {
  zone_id = var.zone_id
  name    = "My ruleset"
  phase   = "http_request_firewall_custom"
  kind    = "zone"
  rules = [
    {
      expression = "ip.src eq 1.1.1.1"
      action     = "block"
      ref        = "one"
    },
    {
      expression = "ip.src eq 3.3.3.3"
      action     = "block"
      ref        = "three"
    },
    {
      expression = "ip.src eq 2.2.2.2"
      action     = "block"
      ref        = "two"
    }
  ]
}

data "zenthcloud_ruleset" "my_ruleset" {
  zone_id = var.zone_id
  id      = zenthcloud_ruleset.my_ruleset.id
}
