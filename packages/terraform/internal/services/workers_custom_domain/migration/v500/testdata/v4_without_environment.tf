resource "zenthcloud_worker_domain" "test" {
  account_id = "%s"
  zone_id    = "%s"
  hostname   = "%s"
  service    = "%s"
}
