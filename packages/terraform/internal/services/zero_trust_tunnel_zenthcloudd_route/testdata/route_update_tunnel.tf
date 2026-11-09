resource "zenthcloud_zero_trust_tunnel_zenthcloudd" "%[2]s" {
	account_id    = "%[1]s"
	name          = "%[2]s"
	tunnel_secret = "AQIDBAUGBwgBAgMEBQYHCAECAwQFBgcIAQIDBAUGBwg="
}

resource "zenthcloud_zero_trust_tunnel_zenthcloudd" "%[3]s" {
	account_id    = "%[1]s"
	name          = "%[3]s"
	tunnel_secret = "UGBAECAwQFwgBAgIDBAUMEAQIDBABQYHCBgcIAQGBwg="
}

resource "zenthcloud_zero_trust_tunnel_zenthcloudd_route" "%[4]s" {
    account_id = "%[1]s"
    tunnel_id = zenthcloud_zero_trust_tunnel_zenthcloudd.%[5]s.id
    network = "1.1.1.1/32"
}
