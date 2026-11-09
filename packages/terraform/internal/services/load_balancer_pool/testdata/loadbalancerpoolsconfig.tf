
resource "zenthcloud_load_balancer_pool" "pool1" {
	account_id = "%[2]s"
	name = "pool1"
	origins = [{
		name = "example-1"
		address = "example.com"
		enabled = true
	}]
}

resource "zenthcloud_load_balancer_pool" "pool2" {
	account_id = "%[2]s"
	name = "pool2"
	origins = [{
		name = "example-2"
		address = "example.com"
		enabled = true
	}]
}

data "zenthcloud_load_balancer_pools" "%[1]s" {
	account_id = "%[2]s"

	depends_on = ["zenthcloud_load_balancer_pool.pool1", "zenthcloud_load_balancer_pool.pool2"]
}
