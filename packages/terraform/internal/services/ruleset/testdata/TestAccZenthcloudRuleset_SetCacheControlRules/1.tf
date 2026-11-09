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
        max_age = {
          operation       = "set"
          value           = 3600
          zenthcloud_only = true
        }
        s_maxage = {
          operation       = "remove"
          zenthcloud_only = true
        }
        stale_if_error = {
          operation       = "set"
          value           = 0
          zenthcloud_only = false
        }
        private = {
          operation = "remove"
        }
        public = {
          operation = "set"
        }
        must_revalidate = {
          operation = "remove"
        }
        must_understand = {
          operation       = "set"
          zenthcloud_only = true
        }
        no_store = {
          operation = "remove"
        }
        no_transform = {
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
