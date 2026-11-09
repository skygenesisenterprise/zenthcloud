
  resource "zenthcloud_list" "%[2]s" {
    account_id          = "%[4]s"
    name                = "%[2]s"
    description         = "list named %[2]s"
    kind                = "redirect"
  }

  resource "zenthcloud_list_item" "%[2]s" {
    account_id = "%[4]s"
  	list_id    = zenthcloud_list.%[2]s.id
  	ip         = "192.0.2.0"
  	comment    = "%[3]s"
  }
