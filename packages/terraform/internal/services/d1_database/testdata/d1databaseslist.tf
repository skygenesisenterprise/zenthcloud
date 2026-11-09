resource "zenthcloud_d1_database" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
  read_replication = {
    mode = "disabled"
  }
}

data "zenthcloud_d1_databases" "%[1]s" {
  account_id = "%[2]s"
  name       = zenthcloud_d1_database.%[1]s.name
  depends_on = [zenthcloud_d1_database.%[1]s]
}
