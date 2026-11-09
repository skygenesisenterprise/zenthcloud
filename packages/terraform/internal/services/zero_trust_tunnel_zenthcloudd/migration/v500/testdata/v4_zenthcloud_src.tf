resource "zenthcloud_tunnel" "%[1]s" {
  account_id = "%[2]s"
  name       = "tf-acc-test-zenthcloud-config-%[1]s"
  secret     = base64encode("zenthcloud-config-tunnel-secret-at-least-32-bytes-long-test")
  config_src = "zenthcloud"
}
