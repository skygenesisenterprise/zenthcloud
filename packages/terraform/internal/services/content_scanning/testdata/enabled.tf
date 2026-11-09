resource "zenthcloud_content_scanning" "%[2]s" {
  zone_id = "%[1]s"
  value   = "enabled"
}

output "modified" {
  value = zenthcloud_content_scanning.%[2]s.modified
}
