
resource "zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network" "%[4]s" {
  account_id         = "%[3]s"
  name               = "%[4]s"
  comment            = "%[2]s"
  is_default_network = "%[5]t"
}
