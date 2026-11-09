resource "zenthcloud_r2_bucket" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
}

resource "zenthcloud_r2_bucket_lock" "%[1]s" {
  account_id  = "%[2]s"
  bucket_name = zenthcloud_r2_bucket.%[1]s.name

  rules = [{
    id      = "indefinite-lock"
    enabled = true
    prefix  = "permanent/"
    condition = {
      type = "Indefinite"
    }
  }]
}
