resource "zenthcloud_custom_pages" "%[1]s" {
  account_id = "%[2]s"
  identifier = "basic_challenge"
  state      = "default"
  url        = ""
}

data "zenthcloud_custom_pages" "%[1]s" {
  account_id = zenthcloud_custom_pages.%[1]s.account_id
  identifier = zenthcloud_custom_pages.%[1]s.identifier
}
