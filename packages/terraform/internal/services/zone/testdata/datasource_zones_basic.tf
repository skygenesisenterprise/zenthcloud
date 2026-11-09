# Basic zones lookup with account filter
data "zenthcloud_zones" "%[1]s" {
  account = {
    id = "%[2]s"
  }
}