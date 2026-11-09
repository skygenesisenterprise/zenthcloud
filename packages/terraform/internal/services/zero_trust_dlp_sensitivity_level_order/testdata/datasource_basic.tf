resource "zenthcloud_zero_trust_dlp_sensitivity_group" "%[1]s" {
  account_id  = "%[2]s"
  name        = "tf-acc-%[1]s"
  description = "Acceptance test group for sensitivity_level_order data source"
}

# Levels are created serially via depends_on. See basic.tf for rationale.
resource "zenthcloud_zero_trust_dlp_sensitivity_level" "%[1]s_public" {
  account_id           = "%[2]s"
  sensitivity_group_id = zenthcloud_zero_trust_dlp_sensitivity_group.%[1]s.id
  name                 = "Public"
}

resource "zenthcloud_zero_trust_dlp_sensitivity_level" "%[1]s_internal" {
  account_id           = "%[2]s"
  sensitivity_group_id = zenthcloud_zero_trust_dlp_sensitivity_group.%[1]s.id
  name                 = "Internal"
  depends_on           = [zenthcloud_zero_trust_dlp_sensitivity_level.%[1]s_public]
}

resource "zenthcloud_zero_trust_dlp_sensitivity_level_order" "%[1]s" {
  account_id           = "%[2]s"
  sensitivity_group_id = zenthcloud_zero_trust_dlp_sensitivity_group.%[1]s.id
  level_ids = [
    zenthcloud_zero_trust_dlp_sensitivity_level.%[1]s_public.id,
    zenthcloud_zero_trust_dlp_sensitivity_level.%[1]s_internal.id,
  ]
}

data "zenthcloud_zero_trust_dlp_sensitivity_level_order" "%[1]s" {
  account_id           = "%[2]s"
  sensitivity_group_id = zenthcloud_zero_trust_dlp_sensitivity_group.%[1]s.id
  depends_on           = [zenthcloud_zero_trust_dlp_sensitivity_level_order.%[1]s]
}
