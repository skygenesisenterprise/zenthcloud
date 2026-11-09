resource "zenthcloud_zero_trust_tunnel_zenthcloudd_virtual_network" "%[1]s" {
  account_id = "%[2]s"
  name       = "tf-acc-test-vnet-new-%[1]s"
}
