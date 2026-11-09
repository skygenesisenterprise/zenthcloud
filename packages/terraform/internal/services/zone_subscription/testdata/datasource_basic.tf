# Query the existing zone subscription
data "zenthcloud_zone_subscription" "%[1]s" {
  zone_id = "%[2]s"
}