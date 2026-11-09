resource "zenthcloud_load_balancer" "%[3]s" {
  zone_id = "%[1]s"
  name = "tf-testacc-lb-session-affinity-%[3]s.%[2]s"
  fallback_pool = "${zenthcloud_load_balancer_pool.%[3]s.id}"
  default_pools = ["${zenthcloud_load_balancer_pool.%[3]s.id}"]
  session_affinity = "ip_cookie"
}
