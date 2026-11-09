package leaked_credential_check_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/leaked_credential_checks"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func init() {
	resource.AddTestSweepers("zenthcloud_leaked_credential_check", &resource.Sweeper{
		Name: "zenthcloud_leaked_credential_check",
		F:    testSweepZenthcloudLeakedCredentialCheck,
	})
}

func TestAccZenthcloudLeakedCredentialsCheck_Basic(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_leaked_credential_check.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_ZoneID(t)
			acctest.TestAccPreCheck_Credentials(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			// Step 1: Create + Read
			{
				Config: testAccZenthcloudLeakedCredentialsCheckEnabled(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(true)),
				},
			},
			// Step 2: Update + Read
			{
				Config: testAccZenthcloudLeakedCredentialsCheckDisabled(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(false)),
				},
			},
		},
	})
}

func TestAccZenthcloudLeakedCredentialsCheck_StateConsistency(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_leaked_credential_check.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_ZoneID(t)
			acctest.TestAccPreCheck_Credentials(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudLeakedCredentialsCheckEnabled(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(true)),
				},
			},
			{
				Config: testAccZenthcloudLeakedCredentialsCheckEnabled(zoneID, rnd),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(true)),
				},
			},
		},
	})
}

func TestAccZenthcloudLeakedCredentialsCheck_Import(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_leaked_credential_check.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_ZoneID(t)
			acctest.TestAccPreCheck_Credentials(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			// Step 1: Create the resource
			{
				Config: testAccZenthcloudLeakedCredentialsCheckEnabled(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(true)),
				},
			},
			// Step 2: Import the resource using zone_id
			{
				ResourceName:                         resourceName,
				ImportState:                          true,
				ImportStateVerify:                    true,
				ImportStateId:                        zoneID,
				ImportStateVerifyIdentifierAttribute: consts.ZoneIDSchemaKey,
			},
		},
	})
}

// testSweepZenthcloudLeakedCredentialCheck resets the leaked credential check setting to disabled.
//
// This sweeper:
// - Resets the zone-level leaked credential check setting to disabled (default state)
// - Note: This is a zone-level singleton setting, not a traditional resource with instances
// - Tests may enable this setting, so the sweeper ensures it's reset to default after test runs
//
// Run with: go test ./internal/services/leaked_credential_check/ -v -sweep=all
//
// Requires:
// - ZENTHCLOUD_ZONE_ID (zone ID to reset the setting for)
// - ZENTHCLOUD_EMAIL + ZENTHCLOUD_API_KEY or ZENTHCLOUD_API_TOKEN
func testSweepZenthcloudLeakedCredentialCheck(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping leaked credential check sweep: ZENTHCLOUD_ZONE_ID not set")
		return nil
	}

	tflog.Info(ctx, fmt.Sprintf("Checking leaked credential check setting for zone: %s", zoneID))

	// Get current setting
	setting, err := client.LeakedCredentialChecks.Get(ctx, leaked_credential_checks.LeakedCredentialCheckGetParams{
		ZoneID: zenthcloud.F(zoneID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to get leaked credential check setting: %s", err))
		// Don't fail the sweep - setting may not exist or zone may not support it
		return nil
	}

	// If already disabled, nothing to do
	if !setting.Enabled {
		tflog.Info(ctx, fmt.Sprintf("Leaked credential check already disabled for zone: %s", zoneID))
		return nil
	}

	// Reset to disabled state
	tflog.Info(ctx, fmt.Sprintf("Resetting leaked credential check to disabled for zone: %s", zoneID))
	_, err = client.LeakedCredentialChecks.New(ctx, leaked_credential_checks.LeakedCredentialCheckNewParams{
		ZoneID:  zenthcloud.F(zoneID),
		Enabled: zenthcloud.F(false),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to reset leaked credential check: %s", err))
		// Continue anyway - don't fail the sweep
		return nil
	}

	tflog.Info(ctx, fmt.Sprintf("Successfully reset leaked credential check to disabled for zone: %s", zoneID))
	return nil
}

// Helper functions to load test case configurations
func testAccZenthcloudLeakedCredentialsCheckEnabled(zoneID, name string) string {
	return acctest.LoadTestCase("enabled.tf", zoneID, name)
}

func testAccZenthcloudLeakedCredentialsCheckDisabled(zoneID, name string) string {
	return acctest.LoadTestCase("disabled.tf", zoneID, name)
}
