resource "zenthcloud_workers_kv_namespace" "%[1]s" {
  account_id = "%[3]s"
  title      = "%[4]s"
}

resource "zenthcloud_workers_kv_namespace" "%[2]s" {
  account_id = "%[3]s"
  title      = "%[5]s"
}
