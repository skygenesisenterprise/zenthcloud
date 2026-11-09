
resource "zenthcloud_zero_trust_tunnel_zenthcloudd" "%[1]s" {
  account_id    = "%[2]s"
  name          = "%[1]s"
  tunnel_secret = "%[3]s"
}

resource "zenthcloud_zero_trust_tunnel_zenthcloudd_config" "%[1]s" {
  account_id         = "%[2]s"
  tunnel_id          = zenthcloud_zero_trust_tunnel_zenthcloudd.%[1]s.id

  config = {
  origin_request = {
    connect_timeout          = 60
    tls_timeout              = 60
    tcp_keep_alive           = 60
    no_happy_eyeballs        = false
    keep_alive_connections   = 1024
    keep_alive_timeout       = 60
    http_host_header         = "baz"
    origin_server_name       = "foobar"
    ca_pool                  = "/path/to/unsigned/ca/pool"
    no_tls_verify            = false
    disable_chunked_encoding = false
    proxy_type               = "socks"
    http2_origin             = true
  }

  ingress = [
    {
      hostname = "foo"
      path     = "/bar"
      service  = "http://10.0.0.2:8080"
      origin_request = {
        connect_timeout = 15
      }
    },
    {
      hostname = "bar"
      path     = "/foo"
      service  = "http://10.0.0.3:8081"
      origin_request = {
        access = {
          required  = true
          team_name = "terraform"
          aud_tag   = ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"]
        }
      }
    },
    {
      service = "https://10.0.0.4:8082"
    }
  ]}
}

data "zenthcloud_zero_trust_tunnel_zenthcloudd_config" "%[1]s" {
  account_id    = zenthcloud_zero_trust_tunnel_zenthcloudd_config.%[1]s.account_id
  tunnel_id     = zenthcloud_zero_trust_tunnel_zenthcloudd.%[1]s.id
  depends_on = ["zenthcloud_zero_trust_tunnel_zenthcloudd.%[1]s", "zenthcloud_zero_trust_tunnel_zenthcloudd_config.%[1]s"]
}
