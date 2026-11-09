resource "zenthcloud_workers_for_platforms_dispatch_namespace" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[3]s"
}

moved {
  from = zenthcloud_workers_for_platforms_namespace.%[1]s
  to   = zenthcloud_workers_for_platforms_dispatch_namespace.%[1]s
}
