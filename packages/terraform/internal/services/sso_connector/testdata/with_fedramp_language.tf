resource "zenthcloud_zero_trust_access_identity_provider" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
  type       = "azureAD"
  config = {
    client_id     = "test"
    client_secret = "test"
    directory_id  = "directory"
  }
}

resource "zenthcloud_sso_connector" "%[1]s" {
  account_id           = "%[2]s"
  email_domain         = "%[1]s.example.com"
  begin_verification   = false
  enabled              = false
  use_fedramp_language = true
  depends_on           = [zenthcloud_zero_trust_access_identity_provider.%[1]s]
}
