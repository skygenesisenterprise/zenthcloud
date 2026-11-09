resource "zenthcloud_zero_trust_device_custom_profile" "%[1]s_profile" {
  account_id  = "%[2]s"
  name        = "Test Custom Profile Basic"
  description = "Custom profile for migration testing"
  match       = "identity.email == \"test@example.com\""
  precedence  = %[3]d
}

moved {
  from = zenthcloud_zero_trust_device_profiles.%[1]s_profile
  to   = zenthcloud_zero_trust_device_custom_profile.%[1]s_profile
}

resource "zenthcloud_zero_trust_device_custom_profile_local_domain_fallback" "%[1]s" {
  account_id = "%[2]s"
  policy_id  = zenthcloud_zero_trust_device_custom_profile.%[1]s_profile.id

  domains = [
    {
      suffix = "example.com"
    }
  ]
}

moved {
  from = zenthcloud_zero_trust_local_fallback_domain.%[1]s
  to   = zenthcloud_zero_trust_device_custom_profile_local_domain_fallback.%[1]s
}
