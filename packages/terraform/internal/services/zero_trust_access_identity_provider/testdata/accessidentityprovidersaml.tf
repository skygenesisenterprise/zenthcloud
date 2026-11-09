
resource "zenthcloud_zero_trust_access_identity_provider" "%[2]s" {
  account_id = "%[1]s"
  name = "%[2]s"
  type = "saml"
  config = {
    issuer_url = "jumpcloud"
    sso_target_url = "https://github.com/skygenesisenterprise/zenthcloud"
    attributes = ["email", "username"]
    idp_public_certs = [
      "MIIDpDCCAoygAwIBAgIGAV2ka+55MA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG\nA1UEC…..GF/Q2/MHadws97cZg\nuTnQyuOqPuHbnN83d/2l1NSYKCbHt24o"
    ]
  }
}
