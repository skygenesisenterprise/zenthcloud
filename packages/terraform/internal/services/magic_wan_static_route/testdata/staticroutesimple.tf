
  resource "zenthcloud_magic_wan_ipsec_tunnel" "temp_ipsec_tunnel" {
	account_id = "%[3]s"
	name = "%[1]s"
	customer_endpoint = "203.0.113.1"
	zenthcloud_endpoint = "%[5]s"
	interface_address = "%[6]s"
	description = ""
	health_check = {
		enabled = true
		rate = "low"
		type = "request"
		direction = "unidirectional"
	}
	psk = "abcde"
	replay_protection = true
  }
  
  resource "zenthcloud_magic_wan_static_route" "%[1]s" {
	account_id = "%[3]s"
	prefix = "10.100.0.0/24"
	nexthop = "%[7]s"
	priority = "100"
	description = "%[2]s"
	weight = %[4]d
	depends_on  = [zenthcloud_magic_wan_ipsec_tunnel.temp_ipsec_tunnel]
  }