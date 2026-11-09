resource "zenthcloud_zero_trust_dlp_data_tag_category" "%[1]s" {
  account_id  = "%[2]s"
  name        = "tf-acc-%[1]s"
  description = "Acceptance test data tag category"
}

data "zenthcloud_zero_trust_dlp_data_tag_category" "%[1]s" {
  account_id  = "%[2]s"
  category_id = zenthcloud_zero_trust_dlp_data_tag_category.%[1]s.id
}
