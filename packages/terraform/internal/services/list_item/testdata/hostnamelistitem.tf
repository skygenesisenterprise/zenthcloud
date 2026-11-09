
  resource "zenthcloud_list" "%[2]s" {
    account_id          = "%[4]s"
    name                = "%[2]s"
    description         = "list named %[2]s"
    kind                = "hostname"
  }

  resource "zenthcloud_list_item" "%[1]s" {
    account_id = "%[4]s"
  	list_id    = zenthcloud_list.%[2]s.id
  	comment    = "%[3]s"
  	hostname = {
  		url_hostname = "example.com"
  	}
  }
