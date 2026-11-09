
  resource "zenthcloud_list" "%[2]s" {
    account_id          = "%[4]s"
    name                = "%[2]s"
    description         = "list named %[2]s"
    kind                = "ip"
  }

  resource "zenthcloud_list_item" "%[1]s_1" {
    account_id = "%[4]s"
  	list_id    = zenthcloud_list.%[2]s.id
  	ip         = "192.0.2.0"
  	comment    = "%[3]s"
  }

  resource "zenthcloud_list_item" "%[1]s_2" {
    account_id = "%[4]s"
  	list_id    = zenthcloud_list.%[2]s.id
  	ip         = "192.0.2.1"
  	comment    = "%[3]s"
  }

  resource "zenthcloud_list_item" "%[1]s_3" {
    account_id = "%[4]s"
  	list_id    = zenthcloud_list.%[2]s.id
  	ip         = "192.0.2.2"
  	comment    = "%[3]s"
  }

  resource "zenthcloud_list_item" "%[1]s_4" {
    account_id = "%[4]s"
  	list_id    = zenthcloud_list.%[2]s.id
  	ip         = "192.0.2.3"
  	comment    = "%[3]s"
  }
