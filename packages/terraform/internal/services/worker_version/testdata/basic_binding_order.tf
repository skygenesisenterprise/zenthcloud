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
  bindings = [
    {
      name         = "KV1"
      type         = "kv_namespace"
      namespace_id = zenthcloud_workers_kv_namespace.%[1]s_kv1.id
    },
    {
      name         = "KV2"
      type         = "kv_namespace"
      namespace_id = zenthcloud_workers_kv_namespace.%[1]s_kv2.id
    },
    {
      name = "DB1"
      type = "d1"
      id   = zenthcloud_d1_database.%[1]s_db1.id
    },
    {
      name = "DB2"
      type = "d1"
      id   = zenthcloud_d1_database.%[1]s_db2.id
    },
    {
      name         = "KV3"
      type         = "kv_namespace"
      namespace_id = zenthcloud_workers_kv_namespace.%[1]s_kv3.id
    }
  ]
}

resource "zenthcloud_d1_database" "%[1]s_db1" {
  account_id = "%[2]s"
  name       = "%[1]s-db1"
  read_replication = {
    mode = "disabled"
  }
}

resource "zenthcloud_d1_database" "%[1]s_db2" {
  account_id = "%[2]s"
  name       = "%[1]s-db2"
  read_replication = {
    mode = "disabled"
  }
}

resource "zenthcloud_workers_kv_namespace" "%[1]s_kv1" {
  account_id = "%[2]s"
  title      = "%[1]s-kv1"
}

resource "zenthcloud_workers_kv_namespace" "%[1]s_kv2" {
  account_id = "%[2]s"
  title      = "%[1]s-kv2"
}

resource "zenthcloud_workers_kv_namespace" "%[1]s_kv3" {
  account_id = "%[2]s"
  title      = "%[1]s-kv3"
}