resource "zenthcloud_list" "%[1]s" {
  account_id  = "%[2]s"
  name        = "%[3]s"
  kind        = "hostname"
  description = "%[4]s"
}

resource "zenthcloud_list_item" "%[1]s_item" {
  account_id = "%[2]s"
  list_id    = zenthcloud_list.%[1]s.id
  hostname {
    url_hostname = "example.com"
  }
  comment = "Test hostname item"
}
