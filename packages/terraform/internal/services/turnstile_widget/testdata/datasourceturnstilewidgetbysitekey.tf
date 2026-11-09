resource "zenthcloud_turnstile_widget" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
  domains    = ["example.com"]
  mode       = "managed"
}

data "zenthcloud_turnstile_widget" "%[1]s" {
  account_id = "%[2]s"
  sitekey    = zenthcloud_turnstile_widget.%[1]s.sitekey
}
