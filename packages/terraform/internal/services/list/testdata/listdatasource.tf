resource "zenthcloud_list" "%[1]s" {
  account_id = "%[2]s"
  name = "%[3]s"
  description = "%[4]s"
  kind = "%[5]s"
}

data "zenthcloud_list" "%[1]s" {
  account_id = "%[2]s"
  list_id    = zenthcloud_list.%[1]s.id
}
