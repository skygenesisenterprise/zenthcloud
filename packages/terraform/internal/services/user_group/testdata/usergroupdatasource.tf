resource "zenthcloud_user_group" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
}

data "zenthcloud_user_groups" "%[1]s" {
  account_id = "%[2]s"
  depends_on = [zenthcloud_user_group.%[1]s]
}

data "zenthcloud_user_group" "%[1]s" {
  account_id    = "%[2]s"
  user_group_id = zenthcloud_user_group.%[1]s.id
}
