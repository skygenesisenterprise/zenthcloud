# Filter zones by name
data "zenthcloud_zones" "%[1]s" {
  name = "%[2]s"
}