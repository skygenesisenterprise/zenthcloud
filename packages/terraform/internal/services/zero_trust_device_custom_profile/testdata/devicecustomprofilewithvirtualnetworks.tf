resource "zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network" "%[1]s_vnet1" {
  account_id         = "%[2]s"
  name               = "%[1]s-vnet1"
  comment            = "acctest vnet 1"
  is_default_network = false
}

resource "zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network" "%[1]s_vnet2" {
  account_id         = "%[2]s"
  name               = "%[1]s-vnet2"
  comment            = "acctest vnet 2"
  is_default_network = false
}

resource "zenthcloud_zero_trust_device_custom_profile" "%[1]s" {
  account_id  = "%[2]s"
  name        = "%[1]s"
  match       = "identity.email == \"test@example.com\""
  precedence  = %[3]d
  enabled     = true
  description = "Custom profile with virtual_networks"

  virtual_networks = {
    allowed = [
      zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network.%[1]s_vnet1.id,
      zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network.%[1]s_vnet2.id,
    ]
    default = zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network.%[1]s_vnet1.id
  }
}
