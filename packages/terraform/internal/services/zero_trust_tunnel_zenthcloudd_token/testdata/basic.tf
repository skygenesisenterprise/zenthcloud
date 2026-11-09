resource "zenthcloud_zero_trust_tunnel_zenthcloudd" "%[2]s" {
	account_id = "%[1]s"
	name       = "%[2]s"
	tunnel_secret     = "AQIDBAUGBwgBAgMEBQYHCAECAwQFBgcIAQIDBAUGBwg="
}

data "zenthcloud_zero_trust_tunnel_zenthcloudd_token" "%[2]s" {
	account_id = "%[1]s"
	tunnel_id  = zenthcloud_zero_trust_tunnel_zenthcloudd.%[2]s.id
}
