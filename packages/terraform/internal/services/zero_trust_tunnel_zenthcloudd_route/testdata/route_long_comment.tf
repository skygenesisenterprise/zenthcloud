resource "zenthcloud_zero_trust_tunnel_zenthcloudd" "%[1]s" {
	account_id    = "%[2]s"
	name          = "%[1]s"
	tunnel_secret = "AQIDBAUGBwgBAgMEBQYHCAECAwQFBgcIAQIDBAUGBwg="
}

resource "zenthcloud_zero_trust_tunnel_zenthcloudd_route" "%[1]s" {
    account_id = "%[2]s"
    tunnel_id = zenthcloud_zero_trust_tunnel_zenthcloudd.%[1]s.id
    network = "%[3]s"
    comment = "%[4]s"
}