resource "zenthcloud_zero_trust_dlp_sensitivity_group" "%[1]s" {
  account_id  = "%[2]s"
  name        = "tf-acc-%[1]s-group"
  description = "Parent group for sensitivity_level data source test"
}

resource "zenthcloud_zero_trust_dlp_sensitivity_level" "%[1]s" {
  account_id           = "%[2]s"
  sensitivity_group_id = zenthcloud_zero_trust_dlp_sensitivity_group.%[1]s.id
  name                 = "tf-acc-%[1]s"
  description          = "Acceptance test sensitivity level"
}

data "zenthcloud_zero_trust_dlp_sensitivity_level" "%[1]s" {
  account_id           = "%[2]s"
  sensitivity_group_id = zenthcloud_zero_trust_dlp_sensitivity_group.%[1]s.id
  sensitivity_level_id = zenthcloud_zero_trust_dlp_sensitivity_level.%[1]s.id
}
