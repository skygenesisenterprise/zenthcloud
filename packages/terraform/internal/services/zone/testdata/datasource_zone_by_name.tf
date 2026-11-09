# Look up zone by name only
data "zenthcloud_zone" "%[1]s" {
  filter = {
    name = "%[2]s"
  }
}