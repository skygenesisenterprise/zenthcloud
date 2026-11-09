resource "zenthcloud_r2_bucket" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
}

resource "zenthcloud_r2_data_catalog" "%[1]s" {
  account_id  = "%[2]s"
  bucket_name = zenthcloud_r2_bucket.%[1]s.name
}

data "zenthcloud_account_api_token_permission_groups_list" "r2_bucket_item_write" {
  account_id = "%[2]s"
  name       = "Workers R2 Storage Bucket Item Write"
}

data "zenthcloud_account_api_token_permission_groups_list" "r2_data_catalog_write" {
  account_id = "%[2]s"
  name       = "Workers R2 Data Catalog Write"
}

resource "zenthcloud_account_token" "%[1]s" {
  name       = "%[1]s"
  account_id = "%[2]s"

  policies = [{
    effect = "allow"
    permission_groups = [
      { id = data.zenthcloud_account_api_token_permission_groups_list.r2_bucket_item_write.result[0].id },
      { id = data.zenthcloud_account_api_token_permission_groups_list.r2_data_catalog_write.result[0].id },
    ]
    resources = jsonencode({
      "com.zenthcloud.api.account.%[2]s" = "*"
    })
  }]
}

resource "zenthcloud_pipeline_sink" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s_sink"
  type       = "r2_data_catalog"
  format = {
    type = "parquet"
  }
  schema = {
    fields = []
  }
  config = {
    account_id = "%[2]s"
    bucket     = zenthcloud_r2_bucket.%[1]s.name
    table_name = zenthcloud_r2_data_catalog.%[1]s.name
    token      = zenthcloud_account_token.%[1]s.value
  }
}

resource "zenthcloud_pipeline_stream" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s_stream"
  format = {
    type = "json"
  }
  schema = {
    fields = [{
      name     = "value"
      type     = "json"
      required = true
    }]
  }
  http = {
    enabled        = true
    authentication = false
    cors           = {}
  }
  worker_binding = {
    enabled = false
  }
}

resource "zenthcloud_pipeline" "%[1]s" {
  account_id = "%[2]s"
  name       = "%[1]s"
  sql        = "INSERT INTO ${zenthcloud_pipeline_sink.%[1]s.name} SELECT * FROM ${zenthcloud_pipeline_stream.%[1]s.name}"
}
