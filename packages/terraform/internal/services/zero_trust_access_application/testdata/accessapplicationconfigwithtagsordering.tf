resource "zenthcloud_zero_trust_access_tag" "tag_ccc_%[1]s" {
  account_id = "%[3]s"
  name       = "%[1]s-ccc"
}

resource "zenthcloud_zero_trust_access_tag" "tag_aaa_%[1]s" {
  account_id = "%[3]s"
  name       = "%[1]s-aaa"
}

resource "zenthcloud_zero_trust_access_tag" "tag_bbb_%[1]s" {
  account_id = "%[3]s"
  name       = "%[1]s-bbb"
}

resource "zenthcloud_zero_trust_access_application" "%[1]s" {
  account_id       = "%[3]s"
  name             = "%[1]s"
  domain           = "%[1]s.%[2]s"
  type             = "self_hosted"
  session_duration = "24h"
  tags             = [
    zenthcloud_zero_trust_access_tag.tag_ccc_%[1]s.name,
    zenthcloud_zero_trust_access_tag.tag_aaa_%[1]s.name,
    zenthcloud_zero_trust_access_tag.tag_bbb_%[1]s.name
  ]
}
