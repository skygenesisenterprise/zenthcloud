resource "zenthcloud_worker" "%[1]s" {
  account_id = "%[2]s"
  name = "%[1]s"
}

resource "zenthcloud_worker_version" "%[1]s" {
  account_id = "%[2]s"
  worker_id = zenthcloud_worker.%[1]s.id
  modules = [
    {
      name         = "index.js"
      content_file = "%[3]s"
      content_type = "application/javascript+module"
    }
  ]
  main_module = "index.js"
}

data "zenthcloud_worker_version" "%[1]s" {
  account_id = "%[2]s"
  worker_id = zenthcloud_worker.%[1]s.id
  version_id = zenthcloud_worker_version.%[1]s.id
  include = "modules"
}

