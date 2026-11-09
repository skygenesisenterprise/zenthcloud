
  resource "zenthcloud_list" "%[2]s" {
    account_id          = "%[4]s"
    name                = "%[2]s"
    description         = "list named %[2]s"
    kind                = "ip"
  }

  resource "zenthcloud_list_item" "%[1]s" {
    account_id = "%[4]s"
  	list_id    = zenthcloud_list.%[2]s.id
  	ip         = "192.0.2.0"
  	comment    = "%[3]s"
  }

	resource "zenthcloud_list_item" "%[1]s_no_comment" {
    account_id = "%[4]s"
  	list_id    = zenthcloud_list.%[2]s.id
  	ip         = "192.0.2.1"
  }
