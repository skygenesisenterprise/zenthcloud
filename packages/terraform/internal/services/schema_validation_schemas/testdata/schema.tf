resource "zenthcloud_api_shield_operation" "getAllProductsTwo" {
  zone_id = "%[2]s"
  endpoint = "/products_two"
  host = "api.example.com"
  method = "GET"
}

resource "zenthcloud_schema_validation_schemas" "%[1]s" {
  zone_id = "%[2]s"
  kind = "openapi_v3"
  name = "%[1]s.yaml"
  source = file("testdata/test_schema.yaml")
  validation_enabled = %[3]s
}
