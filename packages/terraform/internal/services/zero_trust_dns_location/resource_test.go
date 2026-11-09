package zero_trust_dns_location_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_dns_location", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_dns_location",
		F:    testSweepZenthcloudZeroTrustDNSLocation,
	})
}

func testSweepZenthcloudZeroTrustDNSLocation(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client()
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	locations, _, err := client.TeamsLocations(ctx, accountID)
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zero Trust DNS Locations: %s", err))
		return err
	}

	for _, location := range locations {
		if !utils.ShouldSweepResource(location.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting Zero Trust DNS Location: %s", location.ID))
		err := client.DeleteTeamsLocation(ctx, accountID, location.ID)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete Zero Trust DNS Location %s: %s", location.ID, err))
		}
	}

	return nil
}

func TestAccZenthcloudTeamsLocationBasic(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_dns_location.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsLocationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsLocationConfigBasic(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "name", rnd),
				),
			},
		},
	})
}

func testAccZenthcloudTeamsLocationConfigBasic(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslocationconfigbasic.tf", rnd, accountID)
}

func testAccCheckZenthcloudTeamsLocationDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_dns_location" {
			continue
		}

		_, err := client.TeamsLocation(context.Background(), rs.Primary.Attributes[consts.AccountIDSchemaKey], rs.Primary.ID)
		if err == nil {
			return fmt.Errorf("teams Location still exists")
		}
	}

	return nil
}

func TestAccUpgradeZeroTrustDnsLocation_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	config := testAccZenthcloudTeamsLocationConfigBasic(rnd, accountID)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.16.0",
					},
				},
				Config:             config,
				ExpectNonEmptyPlan: true,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectNonEmptyPlan(),
					},
				},
			},
			{
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Config:                   config,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}
