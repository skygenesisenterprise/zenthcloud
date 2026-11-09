resource "zenthcloud_zero_trust_tunnel_zenthcloudd_route" "%[1]s" {
  account_id = "%[2]s"
  tunnel_id  = "%[3]s"
  network    = "%[4]s"
  comment    = "IPv6 tunnel route"
}
