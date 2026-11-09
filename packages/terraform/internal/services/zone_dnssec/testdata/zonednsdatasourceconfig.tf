resource "zenthcloud_zone_dnssec" "%[1]s" {
  zone_id = "%[2]s"
  status = "active"
}

data "zenthcloud_zone_dnssec" "%[1]s" {
  zone_id = "%[2]s"
  depends_on = [ "zenthcloud_dns_zone_dnssec.%[1]s" ]
}
