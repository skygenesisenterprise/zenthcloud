
resource "zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network" "%[2]s" {
	account_id = "%[1]s"
	name       = "%[2]s"
	comment     = "test"
  is_default_network = "false"
}

data "zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network" "%[2]s" {
  virtual_network_id = zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network.%[2]s.id
	account_id = zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network.%[2]s.account_id
	depends_on = ["zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network.%[2]s"]
}
