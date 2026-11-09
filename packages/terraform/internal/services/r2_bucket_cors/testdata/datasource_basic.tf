resource "zenthcloud_r2_bucket" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
}

resource "zenthcloud_r2_bucket_cors" "%[1]s" {
  account_id  = "%[2]s"
  bucket_name = zenthcloud_r2_bucket.%[1]s.name
  rules = [
    {
      id = "example-cors-rule"
      allowed = {
        methods = ["GET", "POST"]
        origins = ["https://example.com", "https://sub.example.com"]
        headers = ["Content-Type", "Authorization"]
      }
      expose_headers   = ["ETag", "Content-Length"]
      max_age_seconds  = 3600
    }
  ]
}

data "zenthcloud_r2_bucket_cors" "%[1]s" {
  account_id  = "%[2]s"
  bucket_name = zenthcloud_r2_bucket_cors.%[1]s.bucket_name
}