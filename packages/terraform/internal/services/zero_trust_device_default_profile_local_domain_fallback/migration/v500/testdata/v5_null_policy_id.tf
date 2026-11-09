resource "zenthcloud_zero_trust_device_default_profile_local_domain_fallback" "%[1]s" {
  account_id = "%[2]s"

  domains = [
    {
      suffix      = "test.example.com"
      description = "Test domain with null policy_id"
      dns_server  = ["10.2.0.1"]
    }
  ]
}

moved {
  from = zenthcloud_zero_trust_local_fallback_domain.%[1]s
  to   = zenthcloud_zero_trust_device_default_profile_local_domain_fallback.%[1]s
}
