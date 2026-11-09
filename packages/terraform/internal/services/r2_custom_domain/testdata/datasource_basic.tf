resource "zenthcloud_r2_bucket" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
}

resource "zenthcloud_r2_custom_domain" "%[1]s" {
  account_id  = "%[2]s"
  bucket_name = zenthcloud_r2_bucket.%[1]s.name
  domain      = "%[4]s"
  zone_id     = "%[3]s"
  enabled     = true
}

data "zenthcloud_r2_custom_domain" "%[1]s" {
  account_id  = "%[2]s"
  bucket_name = zenthcloud_r2_bucket.%[1]s.name
  domain      = zenthcloud_r2_custom_domain.%[1]s.domain
}
