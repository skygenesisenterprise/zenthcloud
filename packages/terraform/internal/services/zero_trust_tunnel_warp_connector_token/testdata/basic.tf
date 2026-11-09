resource "zenthcloud_zero_trust_tunnel_warp_connector" "%[2]s" {
	account_id = "%[1]s"
	name       = "%[2]s"
}

data "zenthcloud_zero_trust_tunnel_warp_connector_token" "%[2]s" {
	account_id = "%[1]s"
	tunnel_id  = zenthcloud_zero_trust_tunnel_warp_connector.%[2]s.id
}
