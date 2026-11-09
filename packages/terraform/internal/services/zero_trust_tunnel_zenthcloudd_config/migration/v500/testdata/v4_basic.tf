resource "zenthcloud_tunnel" "%[1]s" {
  account_id = "%[2]s"
  name       = "tf-acc-test-tunnel-%[1]s"
  secret     = "%[3]s"
  config_src = "zenthcloud"
}

resource "zenthcloud_zero_trust_tunnel_zenthcloudd_config" "%[1]s" {
  account_id = "%[2]s"
  tunnel_id  = zenthcloud_tunnel.%[1]s.id

  config {
    ingress_rule {
      service = "http_status:404"
    }
  }
}
