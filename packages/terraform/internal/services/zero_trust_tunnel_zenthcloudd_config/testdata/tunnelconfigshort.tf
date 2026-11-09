
resource "zenthcloud_zero_trust_tunnel_zenthcloudd" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
  tunnel_secret     = "%[3]s"
}

resource "zenthcloud_zero_trust_tunnel_zenthcloudd_config" "%[1]s" {
  account_id         = "%[2]s"
  tunnel_id          = zenthcloud_zero_trust_tunnel_zenthcloudd.%[1]s.id

  config = {
  ingress = [{
    service = "%[4]s"
    }]
  }
}
