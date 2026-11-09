# Filter zones using name pattern
data "zenthcloud_zones" "%[1]s" {
  account = {
    id = "%[2]s"
  }
  name = "%[3]s"
}