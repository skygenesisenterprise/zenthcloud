resource "zenthcloud_zero_trust_list" "%[2]s" {
  %[3]s_id    = "%[4]s"
  name        = "%[2]s"
  type        = "EMAIL"
  description = "Email list test for %[1]s"
  items       = [ { value = "test@example.com" } ]
}

resource "zenthcloud_zero_trust_access_group" "%[1]s" {
  %[3]s_id = "%[4]s"
  name     = "%[1]s"

  include  = [{
    email_list = { id = zenthcloud_zero_trust_list.%[2]s.id }
  }]
}
