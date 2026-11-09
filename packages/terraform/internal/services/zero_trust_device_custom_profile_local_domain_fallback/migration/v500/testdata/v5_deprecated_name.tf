resource "zenthcloud_zero_trust_device_custom_profile" "%[1]s_profile" {
  account_id  = "%[2]s"
  name        = "Deprecated Name Profile"
  description = "Using deprecated resource name"
  match       = "identity.email == \"legacy@example.com\""
  precedence  = %[3]d
}

moved {
  from = zenthcloud_device_settings_policy.%[1]s_profile
  to   = zenthcloud_zero_trust_device_custom_profile.%[1]s_profile
}

resource "zenthcloud_zero_trust_device_custom_profile_local_domain_fallback" "%[1]s" {
  account_id = "%[2]s"
  policy_id  = zenthcloud_zero_trust_device_custom_profile.%[1]s_profile.id

  domains = [
    {
      suffix      = "deprecated.example.com"
      description = "Using deprecated fallback domain name"
    }
  ]
}

moved {
  from = zenthcloud_fallback_domain.%[1]s
  to   = zenthcloud_zero_trust_device_custom_profile_local_domain_fallback.%[1]s
}
