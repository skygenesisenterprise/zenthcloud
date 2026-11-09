resource "zenthcloud_r2_bucket" "%[1]s" {
    account_id    = "%[2]s"
    name          = "%[1]s"
    jurisdiction  = "fedramp"
}

resource "zenthcloud_r2_managed_domain" "%[1]s" {
    account_id = "%[2]s"
    bucket_name = zenthcloud_r2_bucket.%[1]s.name
    enabled = "true"
    jurisdiction = "fedramp"
}
