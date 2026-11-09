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
      action_parameters = {
        response = {
          status_code  = 403
          content      = "Access denied"
          content_type = "text/plain"
        }
      }
    }
  ]
}

data "zenthcloud_ruleset" "my_ruleset" {
  zone_id = var.zone_id
  id      = zenthcloud_ruleset.my_ruleset.id
}
