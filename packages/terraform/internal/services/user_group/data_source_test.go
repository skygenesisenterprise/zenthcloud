package user_group_test

import (
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

// TestAccZenthcloudUserGroup_DataSource verifies both list and single data sources.
func TestAccZenthcloudUserGroup_DataSource(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	listDataName := "data.zenthcloud_user_groups." + rnd
	singleDataName := "data.zenthcloud_user_group." + rnd
	resourceName := "zenthcloud_user_group." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudUserGroupDataSourceConfig(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					// LIST data source verification
					statecheck.ExpectKnownValue(listDataName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(listDataName, tfjsonpath.New("result"), knownvalue.NotNull()),

					// GET single data source verification
					statecheck.ExpectKnownValue(singleDataName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(singleDataName, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(singleDataName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(singleDataName, tfjsonpath.New("created_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(singleDataName, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
				},
				Check: resource.ComposeTestCheckFunc(
					// Verify single data source matches resource
					resource.TestCheckResourceAttrPair(singleDataName, "id", resourceName, "id"),
					resource.TestCheckResourceAttrPair(singleDataName, "name", resourceName, "name"),
					resource.TestCheckResourceAttrPair(singleDataName, "created_on", resourceName, "created_on"),
				),
			},
		},
	})
}

func testAccZenthcloudUserGroupDataSourceConfig(rnd, accountID string) string {
	return acctest.LoadTestCase("usergroupdatasource.tf", rnd, accountID)
}
