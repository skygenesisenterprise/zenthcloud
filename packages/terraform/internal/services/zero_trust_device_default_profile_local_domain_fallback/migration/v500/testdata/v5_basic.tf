resource "zenthcloud_zero_trust_device_default_profile_local_domain_fallback" "%[1]s" {
  account_id = "%[2]s"

  domains = [
    {
      suffix = "example.com"
    }
  ]
}

moved {
  from = zenthcloud_zero_trust_local_fallback_domain.%[1]s
  to   = zenthcloud_zero_trust_device_default_profile_local_domain_fallback.%[1]s
}
