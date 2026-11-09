variable "zone_id" {}

resource "zenthcloud_ruleset" "my_ruleset" {
  zone_id = var.zone_id
  name    = "My cache tags ruleset"
  phase   = "http_response_cache_settings"
  kind    = "zone"
  rules = [
    {
      expression = "http.request.uri.path contains \"/content\""
      action     = "set_cache_tags"
      action_parameters = {
        operation = "set"
        values     = ["content", "public"]
      }
    }
  ]
}

data "zenthcloud_ruleset" "my_ruleset" {
  zone_id = var.zone_id
  id      = zenthcloud_ruleset.my_ruleset.id
}