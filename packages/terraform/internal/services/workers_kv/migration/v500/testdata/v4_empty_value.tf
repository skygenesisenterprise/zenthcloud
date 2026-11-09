resource "zenthcloud_workers_kv_namespace" "%[1]s" {
  account_id = "%[2]s"
  title      = "%[3]s"
}

resource "zenthcloud_workers_kv" "%[4]s" {
  account_id   = "%[2]s"
  namespace_id = zenthcloud_workers_kv_namespace.%[1]s.id
  key          = "%[5]s"
  value        = "%[6]s"
}
