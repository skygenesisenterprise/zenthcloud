resource "zenthcloud_worker" "%[1]s" {
  account_id = "%[2]s"
  name = "%[1]s"
}

resource "zenthcloud_worker_version" "%[1]s" {
  account_id = "%[2]s"
  worker_id = zenthcloud_worker.%[1]s.id
  assets = {
    directory = "%[3]s"
  }
}