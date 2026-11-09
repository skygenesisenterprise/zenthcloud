package api_token_permission_groups_test

import (
	"fmt"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudApiTokenPermissionGroupsDataSource_Basic(t *testing.T) {
	resourceName := "data.zenthcloud_api_token_permission_groups_list.dns_read"

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccApiTokenPermissionGroupsDataSourceConfig(),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("id"), knownvalue.NotNull()),
				},
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", "DNS Read"),
					resource.TestCheckResourceAttr(resourceName, "scope", "com.zenthcloud.api.account.zone"),
				),
			},
		},
	})
}

func testAccApiTokenPermissionGroupsDataSourceConfig() string {
	return fmt.Sprintf(`
		data "zenthcloud_api_token_permission_groups_list" "dns_read" {
			name  = "DNS Read"
			scope = "com.zenthcloud.api.account.zone"
		}`,
	)
}
