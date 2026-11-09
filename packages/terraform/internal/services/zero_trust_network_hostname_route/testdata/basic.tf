resource "zenthcloud_zero_trust_tunnel_zenthcloudd" "%[1]s" {
  account_id    = "%[2]s"
  name          = "%[1]s"
  tunnel_secret = "%[4]s"
}

resource "zenthcloud_zero_trust_network_hostname_route" "%[1]s" {
  account_id = "%[2]s"
  hostname   = "%[3]s.test.example.com"
  tunnel_id  = zenthcloud_zero_trust_tunnel_zenthcloudd.%[1]s.id
  comment    = "Test hostname route for tf-acctest-%[1]s"
}

data "zenthcloud_zero_trust_network_hostname_route" "%[1]s" {
  account_id = "%[2]s"
  hostname_route_id = zenthcloud_zero_trust_network_hostname_route.%[1]s.id
}
