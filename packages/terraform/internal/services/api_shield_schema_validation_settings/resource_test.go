package api_shield_schema_validation_settings_test

import (
	"context"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_api_shield_schema_validation_settings", &resource.Sweeper{
		Name: "zenthcloud_api_shield_schema_validation_settings",
		F:    testSweepZenthcloudAPIShieldSchemaValidationSettings,
	})
}

func testSweepZenthcloudAPIShieldSchemaValidationSettings(r string) error {
	ctx := context.Background()
	// This resource configures zone-level default schema validation settings for API Shield.
	// It's a singleton configuration resource per zone, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "API Shield schema validation settings don't require sweeping (zone settings)")
	return nil
}

func TestAccZenthcloudAPIShieldSchemaValidationSettings_Create(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the API token
	// endpoint does not yet support the API tokens without an explicit scope.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceID := "zenthcloud_api_shield_schema_validation_settings." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		// CheckDestroy:             testAccCheckAPIShieldSchemaValidationSettingsDelete,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAPIShieldSchemaValidationSettingsDefaultMitigationSet(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceID, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceID, "validation_default_mitigation_action", "log"),
					// default
					resource.TestCheckNoResourceAttr(resourceID, "validation_override_mitigation_action"),
				),
			},
			{
				Config: testAccZenthcloudAPIShieldSchemaValidationSettingsAllMitigationsSet(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceID, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceID, "validation_default_mitigation_action", "block"),
					resource.TestCheckResourceAttr(resourceID, "validation_override_mitigation_action", "none"),
				),
			},
		},
	})
}

// func testAccCheckAPIShieldSchemaValidationSettingsDelete(s *terraform.State) error {
// 	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
// 	if clientErr != nil {
// 		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
// 	}

// 	for _, rs := range s.RootModule().Resources {
// 		if rs.Type != "zenthcloud_api_shield_schema_validation_settings" {
// 			continue
// 		}

// 		result, err := client.GetAPIShieldSchemaValidationSettings(
// 			context.Background(),
// 			zenthcloud.ZoneIdentifier(rs.Primary.Attributes[consts.ZoneIDSchemaKey]),
// 		)
// 		if err != nil {
// 			return fmt.Errorf("encountered error getting schema validation settings: %w", err)
// 		}

// 		if result.DefaultMitigationAction != zenthcloudAPIShieldSchemaValidationSettingsDefault().DefaultMitigationAction {
// 			return fmt.Errorf("expected validation_default_mitigation_action to be 'none' but got: %s", result.DefaultMitigationAction)
// 		}

// 		if result.OverrideMitigationAction != nil {
// 			return fmt.Errorf("expected validation_override_mitigation_action to be nil")
// 		}
// 	}

// 	return nil
// }

func testAccZenthcloudAPIShieldSchemaValidationSettingsDefaultMitigationSet(resourceName, zone string) string {
	return acctest.LoadTestCase("apishieldschemavalidationsettingsdefaultmitigationset.tf", resourceName, zone)
}

func testAccZenthcloudAPIShieldSchemaValidationSettingsAllMitigationsSet(resourceName, zone string) string {
	return acctest.LoadTestCase("apishieldschemavalidationsettingsallmitigationsset.tf", resourceName, zone)
}
