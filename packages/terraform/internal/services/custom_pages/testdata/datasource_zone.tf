resource "zenthcloud_custom_pages" "%[1]s" {
  zone_id    = "%[2]s"
  identifier = "500_errors"
  state      = "default"
  url        = ""
}

data "zenthcloud_custom_pages" "%[1]s" {
  zone_id    = zenthcloud_custom_pages.%[1]s.zone_id
  identifier = zenthcloud_custom_pages.%[1]s.identifier
}