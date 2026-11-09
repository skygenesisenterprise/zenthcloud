# Filter zones by account and status
data "zenthcloud_zones" "%[1]s" {
  account = {
    id = "%[2]s"
  }
  status = "%[3]s"
}