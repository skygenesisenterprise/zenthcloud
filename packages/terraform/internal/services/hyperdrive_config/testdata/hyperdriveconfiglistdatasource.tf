resource "zenthcloud_hyperdrive_config" "%[1]s" {
	account_id = "%[2]s"
	name       = "%[3]s"
	origin     = {
		password = "%[4]s"
		database = "%[5]s"
		host     = "%[6]s"
		port     = %[7]d
		scheme   = "%[8]s"
		user     = "%[9]s"
	}
	caching = {
		disabled = %[10]t
	}
}

data "zenthcloud_hyperdrive_configs" "%[1]s" {
	account_id = "%[2]s"
	depends_on = [zenthcloud_hyperdrive_config.%[1]s]
}
