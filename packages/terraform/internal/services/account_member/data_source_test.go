package account_member_test

import (
	"os"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudAccountMembers_Datasource(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	listDataName := "data.zenthcloud_account_members." + rnd
	singleDataName := "data.zenthcloud_account_member." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccountMembersDataSourceConfig(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					// verify LIST api call
					statecheck.ExpectKnownValue(listDataName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(listDataName, tfjsonpath.New("result"), knownvalue.NotNull()),

					// verify READ api call
					statecheck.ExpectKnownValue(singleDataName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(singleDataName, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(singleDataName, tfjsonpath.New("email"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(singleDataName, tfjsonpath.New("user"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(singleDataName, tfjsonpath.New("roles"), knownvalue.NotNull()),
				},
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttrPair(singleDataName, "id", listDataName, "result.0.id"),
					resource.TestCheckResourceAttrPair(singleDataName, "email", listDataName, "result.0.email"),
					resource.TestCheckResourceAttrPair(singleDataName, "status", listDataName, "result.0.status"),
					resource.TestCheckResourceAttrPair(singleDataName, "roles.#", listDataName, "result.0.roles.#"),
					resource.TestCheckResourceAttrPair(singleDataName, "policies.#", listDataName, "result.0.policies.#"),
				),
			},
		},
	})
}

func testAccZenthcloudAccountMembersDataSourceConfig(rnd, accountID string) string {
	return acctest.LoadTestCase("zenthcloud_account_member-datasource-basic.tf", rnd, accountID)
}
