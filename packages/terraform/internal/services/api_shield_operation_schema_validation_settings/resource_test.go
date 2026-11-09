package api_shield_operation_schema_validation_settings_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_api_shield_operation_schema_validation_settings", &resource.Sweeper{
		Name: "zenthcloud_api_shield_operation_schema_validation_settings",
		F:    testSweepZenthcloudAPIShieldOperationSchemaValidationSettings,
	})
}

func testSweepZenthcloudAPIShieldOperationSchemaValidationSettings(r string) error {
	ctx := context.Background()
	// This resource configures schema validation settings for API Shield operations.
	// The settings are tied to operations, so when operations are swept, these settings
	// are automatically removed. No separate sweeping required.
	tflog.Info(ctx, "API Shield operation schema validation settings don't require sweeping (operation settings)")
	return nil
}

func TestAccZenthcloudAPIShieldOperationSchemaValidationSettings_Create(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the API token
	// endpoint does not yet support the API tokens without an explicit scope.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceID := "zenthcloud_api_shield_operation_schema_validation_settings." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	block := "block"
	none := "none"
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAPIShieldOperationSchemaValidationSettingsMitigation(rnd, zoneID, &block),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceID, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceID, "mitigation_action", "block"),
				),
			},
			{
				Config: testAccZenthcloudAPIShieldOperationSchemaValidationSettingsMitigation(rnd, zoneID, nil),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceID, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceID, "mitigation_action", ""),
				),
			},
			{
				Config: testAccZenthcloudAPIShieldOperationSchemaValidationSettingsMitigation(rnd, zoneID, &none),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceID, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceID, "mitigation_action", "none"),
				),
			},
			{
				Config: testAccZenthcloudAPIShieldOperationSchemaValidationSettingsNoMitigation(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceID, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceID, "mitigation_action", ""),
				),
			},
		},
	})
}

func testAccZenthcloudAPIShieldOperationSchemaValidationSettingsMitigation(resourceName, zone string, mitigation *string) string {
	action := "null"
	if mitigation != nil {
		action = fmt.Sprintf("\"%s\"", *mitigation)
	}

	return acctest.LoadTestCase("apishieldoperationschemavalidationsettingsmitigation.tf", resourceName, zone, action)
}

func testAccZenthcloudAPIShieldOperationSchemaValidationSettingsNoMitigation(resourceName, zone string) string {
	return acctest.LoadTestCase("apishieldoperationschemavalidationsettingsnomitigation.tf", resourceName, zone)
}
