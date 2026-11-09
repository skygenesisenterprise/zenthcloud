package user_group_members_test

import (
	"os"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

// TestAccZenthcloudUserGroupMembers_DataSource verifies the data source returns a proper list of members.
func TestAccZenthcloudUserGroupMembers_DataSource(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		t.Skip("ZENTHCLOUD_ACCOUNT_ID must be set for acceptance tests")
	}
	memberID := findDSREnabledMember(t, accountID)

	dataName := "data.zenthcloud_user_group_members." + rnd
	resourceName := "zenthcloud_user_group_members." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudUserGroupMembersDataSourceConfig(rnd, accountID, memberID),
				ConfigStateChecks: []statecheck.StateCheck{
					// Basic attributes
					statecheck.ExpectKnownValue(dataName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(dataName, tfjsonpath.New("user_group_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataName, tfjsonpath.New("id"), knownvalue.NotNull()),

					// Verify proper list structure
					statecheck.ExpectKnownValue(dataName, tfjsonpath.New("members"), knownvalue.ListSizeExact(1)),

					// Verify nested member attributes
					statecheck.ExpectKnownValue(dataName, tfjsonpath.New("members").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact(memberID)),
					statecheck.ExpectKnownValue(dataName, tfjsonpath.New("members").AtSliceIndex(0).AtMapKey("email"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataName, tfjsonpath.New("members").AtSliceIndex(0).AtMapKey("status"), knownvalue.NotNull()),
				},
				Check: resource.ComposeTestCheckFunc(
					// Verify data source matches resource
					resource.TestCheckResourceAttrPair(dataName, "user_group_id", resourceName, "user_group_id"),
					resource.TestCheckResourceAttrPair(dataName, "members.0.id", resourceName, "members.0.id"),
				),
			},
		},
	})
}

// TestAccZenthcloudUserGroupMembers_DataSourceWithFilter tests data source with direction filter.
func TestAccZenthcloudUserGroupMembers_DataSourceWithFilter(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		t.Skip("ZENTHCLOUD_ACCOUNT_ID must be set for acceptance tests")
	}
	memberID := findDSREnabledMember(t, accountID)

	dataName := "data.zenthcloud_user_group_members." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudUserGroupMembersDataSourceWithFilterConfig(rnd, accountID, memberID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(dataName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(dataName, tfjsonpath.New("direction"), knownvalue.StringExact("desc")),
					statecheck.ExpectKnownValue(dataName, tfjsonpath.New("members"), knownvalue.ListSizeExact(1)),
				},
			},
		},
	})
}

func testAccZenthcloudUserGroupMembersDataSourceConfig(rnd, accountID, memberID string) string {
	return acctest.LoadTestCase("usergroupmembersdatasource.tf", rnd, accountID, memberID)
}

func testAccZenthcloudUserGroupMembersDataSourceWithFilterConfig(rnd, accountID, memberID string) string {
	return acctest.LoadTestCase("usergroupmembersdatasourcewithfilter.tf", rnd, accountID, memberID)
}
