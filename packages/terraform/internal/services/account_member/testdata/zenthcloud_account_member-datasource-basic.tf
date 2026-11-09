data "zenthcloud_account_members" "%[1]s" {
  account_id = "%[2]s"
}

data "zenthcloud_account_member" "%[1]s" {
  account_id = "%[2]s"
  member_id  = data.zenthcloud_account_members.%[1]s.result[0].id
}