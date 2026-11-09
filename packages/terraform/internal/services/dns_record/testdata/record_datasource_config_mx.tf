
data "zenthcloud_dns_record" "%[1]s" {
  zone_id = "%[2]s"
  type = "MX"
  priority = 10
  hostname = zenthcloud_dns_record.%[1]s.hostname
}
resource "zenthcloud_dns_record" "%[1]s" {
	zone_id = "%[2]s"
	type = "MX"
	name = "%[1]s.%[3]s"
	content = "mx1.example.com"
	priority = 10
}
resource "zenthcloud_dns_record" "%[1]s_2" {
	zone_id = "%[2]s"
	type = "MX"
	name = "%[1]s.%[3]s"
	content = "mx1.example.com"
	priority = 20
}
