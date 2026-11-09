resource "zenthcloud_access_application" "%[1]s" {
  name    = "%[1]s"
  zone_id = "%[2]s"
  domain  = "%[1]s.%[3]s"
}

resource "zenthcloud_access_ca_certificate" "%[1]s" {
  zone_id        = "%[2]s"
  application_id = zenthcloud_access_application.%[1]s.id
}
