resource "zenthcloud_zero_trust_access_application" "%[1]s" {
  name       = "%[1]s"
  account_id = "%[2]s"
  domain     = "%[1]s.%[3]s"
  type       = "self_hosted"
}

resource "zenthcloud_zero_trust_access_short_lived_certificate" "%[1]s" {
  account_id = "%[2]s"
  app_id     = zenthcloud_zero_trust_access_application.%[1]s.id
}
