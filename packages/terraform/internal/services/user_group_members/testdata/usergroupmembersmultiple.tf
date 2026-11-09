resource "zenthcloud_user_group" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
}

resource "zenthcloud_user_group_members" "%[1]s" {
  account_id    = "%[2]s"
  user_group_id = zenthcloud_user_group.%[1]s.id
  members = [
    { id = "%[3]s" },
    { id = "%[4]s" }
  ]
}
