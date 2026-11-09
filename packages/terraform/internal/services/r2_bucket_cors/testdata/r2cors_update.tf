resource "zenthcloud_r2_bucket" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
}

resource "zenthcloud_r2_bucket_cors" "%[1]s" {
  account_id  = "%[2]s"
  bucket_name = zenthcloud_r2_bucket.%[1]s.name

  rules = [{
    allowed = {
      methods = ["GET", "POST", "PUT"]
      origins = ["https://example.com", "https://test.com"]
      headers = ["Content-Type", "Authorization"]
    }
    id               = "rule1"
    expose_headers   = ["ETag", "Content-Length"]
    max_age_seconds  = 7200
  }, {
    allowed = {
      methods = ["DELETE", "HEAD"]
      origins = ["https://admin.com"]
    }
    id               = "rule2"
    max_age_seconds  = 1800
  }]
}
