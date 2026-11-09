
data "zenthcloud_resource_groups" "all" {
  account_id = "%[1]s"
  name       = "com.zenthcloud.api.account.%[1]s"
}

data "zenthcloud_account_permission_groups" "all" {
  account_id = "%[1]s"
}

locals {
  api_token_permissions_groups_map = {
    for perm in data.zenthcloud_account_permission_groups.all.result :
    perm.name => perm.id
  }
}

resource "zenthcloud_account_member" "test_member" {
  account_id = "%[1]s"
  email      = "%[2]s"
  status     = "accepted"
  policies = [{
    access = "allow"
    resource_groups = [{
      id : data.zenthcloud_resource_groups.all.result[0].id
    }]
    permission_groups = [{
      id : local.api_token_permissions_groups_map["Administrator"]
    }]
  }]
}
