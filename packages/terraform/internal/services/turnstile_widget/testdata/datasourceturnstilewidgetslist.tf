resource "zenthcloud_turnstile_widget" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
  domains    = ["example.com"]
  mode       = "managed"
}

data "zenthcloud_turnstile_widgets" "%[1]s" {
  account_id = "%[2]s"
  depends_on = [zenthcloud_turnstile_widget.%[1]s]
}
