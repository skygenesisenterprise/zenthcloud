variable "zone_id" {}

resource "zenthcloud_ruleset" "my_ruleset" {
  zone_id = var.zone_id
  name    = "My ruleset"
  phase   = "http_response_cache_settings"
  kind    = "zone"
  rules = [
    {
      expression = "any(http.request.headers.values[*] == \"application/json\")"
      action     = "set_cache_control"
      action_parameters = {
        s_maxage = {
          operation       = "set"
          value           = 1800
          zenthcloud_only = true
        }
        stale_while_revalidate = {
          operation = "remove"
        }
        stale_if_error = {
          operation = "remove"
        }
        no_cache = {
          operation = "remove"
        }
        private = {
          operation = "set"
        }
        immutable = {
          operation = "remove"
        }
        must_understand = {
          operation = "remove"
        }
        proxy_revalidate = {
          operation = "set"
        }
        no_store = {
          operation = "set"
        }
      }
    }
  ]
}

data "zenthcloud_ruleset" "my_ruleset" {
  zone_id = var.zone_id
  id      = zenthcloud_ruleset.my_ruleset.id
}
