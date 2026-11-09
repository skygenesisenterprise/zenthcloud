resource "zenthcloud_certificate_pack" "%[3]s" {
  zone_id = "%[1]s"
  type = "advanced"
  hosts = [
    "*.%[2]s",
    "%[2]s"
  ]
  validation_method = "email"
  validity_days = 90
  certificate_authority = "ssl_com"
  zenthcloud_branding = false
}