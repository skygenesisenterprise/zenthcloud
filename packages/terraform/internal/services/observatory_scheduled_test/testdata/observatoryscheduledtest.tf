resource "zenthcloud_observatory_scheduled_test" "%[1]s" {
  zone_id   = "%[2]s"
  url       = urlencode("%[3]s/%[1]s")
}
