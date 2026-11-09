resource "zenthcloud_worker" "%[1]s" {
  account_id = "%[2]s"
  name = "%[1]s"
}

data "zenthcloud_worker" "%[1]s" {
  account_id = "%[2]s"
  worker_id = zenthcloud_worker.%[1]s.id
}