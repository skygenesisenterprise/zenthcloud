
resource "zenthcloud_dns_record" "%[3]s" {
	zone_id = "%[1]s"
	name    = "%[3]s.origin.%[2]s"
	content = "example.com"
	type    = "CNAME"
	ttl     = 3600
}

resource "zenthcloud_spectrum_application" "%[3]s" {
  depends_on = ["zenthcloud_dns_record.%[3]s"]
  zone_id  = "%[1]s"
  protocol = "tcp/22"

  dns = {
    type = "CNAME"
    name = "%[3]s.%[2]s"
  }

  origin_dns = {
    name = "%[3]s.origin.%[2]s"
  }
  origin_port   = 22

  edge_ips = {
    type = "dynamic"
  	connectivity = "all"
  }
}
