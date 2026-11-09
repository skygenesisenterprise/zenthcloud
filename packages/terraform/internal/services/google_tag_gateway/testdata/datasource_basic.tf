resource "zenthcloud_google_tag_gateway" "%[2]s" {
  zone_id          = "%[1]s"
  enabled          = true
  endpoint         = "/gtm"
  hide_original_ip = true
  measurement_id   = "GTM-XXXXXXX"
  set_up_tag       = true
}

data "zenthcloud_google_tag_gateway" "%[2]s" {
  zone_id    = zenthcloud_google_tag_gateway.%[2]s.zone_id
  depends_on = [zenthcloud_google_tag_gateway.%[2]s]
}
