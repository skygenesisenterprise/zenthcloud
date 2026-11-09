variable "account_id" {}

resource "zenthcloud_ruleset" "my_ruleset" {
  account_id = var.account_id
  name       = "My ruleset"
  phase      = "http_request_firewall_custom"
  kind       = "custom"
  rules = [
    {
      expression = "ip.src eq 1.1.1.1"
      action     = "rewrite"
      action_parameters = {
        headers = {
          "Exposed-Credential-Check" = {
            operation = "set"
            value     = "1"
          }
        }
      }
      exposed_credential_check = {
        username_expression = "url_decode(http.request.body.form[\"username\"][0])"
        password_expression = "url_decode(http.request.body.form[\"password\"][0])"
      }
    }
  ]
}

data "zenthcloud_ruleset" "my_ruleset" {
  account_id = var.account_id
  id         = zenthcloud_ruleset.my_ruleset.id
}
