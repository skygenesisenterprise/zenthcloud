resource "zenthcloud_argo_smart_routing" "%[2]s" {
  zone_id = "%[1]s"
  value   = "on"
}

data "zenthcloud_argo_smart_routing" "%[2]s" {
  zone_id = zenthcloud_argo_smart_routing.%[2]s.zone_id

  depends_on = [zenthcloud_argo_smart_routing.%[2]s]
}
