package magic_transit_connector_test

import (
	"context"
	"fmt"
	"os"
	"strconv"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/magic_transit"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_magic_transit_connector", &resource.Sweeper{
		Name: "zenthcloud_magic_transit_connector",
		F:    testSweepZenthcloudMagicTransitConnectors,
	})
}

func testSweepZenthcloudMagicTransitConnectors(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping magic transit connectors sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	connectors, err := client.MagicTransit.Connectors.List(ctx, magic_transit.ConnectorListParams{
		AccountID: zenthcloud.F(accountID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch magic transit connectors: %s", err))
		return fmt.Errorf("failed to fetch magic transit connectors: %w", err)
	}

	if len(connectors.Result) == 0 {
		tflog.Info(ctx, "No magic transit connectors to sweep")
		return nil
	}

	for _, connector := range connectors.Result {
		// Use standard filtering helper on the notes field
		if !utils.ShouldSweepResource(connector.Notes) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting magic transit connector: %s (account: %s)", connector.ID, accountID))
		_, err := client.MagicTransit.Connectors.Delete(ctx, connector.ID, magic_transit.ConnectorDeleteParams{
			AccountID: zenthcloud.F(accountID),
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete magic transit connector %s: %s", connector.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted magic transit connector: %s", connector.ID))
	}

	return nil
}

func TestAccZenthcloudMagicTransitConnectorItWorks(t *testing.T) {
	resourceName := utils.GenerateRandomResourceName()
	tfstateName := fmt.Sprintf("zenthcloud_magic_transit_connector.%s", resourceName)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	// This is a serial number and device id that's dedicated for testing purposes
	serialNumber := "zenthcloud-tfprovider-acceptance-test"
	deviceId := "e71bc6786bed11f087b582b621cd4455"
	// Basic lifecycle, create, plan, import, destroy.
	{
		config := testAccCheckZenthcloudMCONNSimple(resourceName, accountID, serialNumber, "false", resourceName, "4", "0")

		resource.Test(t, resource.TestCase{
			PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
			ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
			Steps: []resource.TestStep{
				// Create the resources
				{
					Config: config,
					ConfigStateChecks: []statecheck.StateCheck{
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("notes"), knownvalue.StringExact(resourceName)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("device").AtMapKey("serial_number"), knownvalue.StringExact(serialNumber)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("device").AtMapKey("id"), knownvalue.StringExact(deviceId)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("activated"), knownvalue.Bool(false)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("interrupt_window_duration_hours"), knownvalue.Float64Exact(4)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("interrupt_window_hour_of_day"), knownvalue.Float64Exact(0)),
					},
					Check: resource.ComposeTestCheckFunc(
						testAccCheckZenthcloudConnectorExists(tfstateName),
					),
				},
				// Plan again to make sure the tf plan is clean
				{
					Config:             config,
					PlanOnly:           true,
					ExpectNonEmptyPlan: false, // expect no change
				},
				// Try importing the resource
				{
					ResourceName: tfstateName,
					ImportStateIdFunc: func(state *terraform.State) (string, error) {
						rs, ok := state.RootModule().Resources[tfstateName]
						if !ok {
							return "", fmt.Errorf("not found: %s", tfstateName)
						}
						return fmt.Sprintf("%s/%s", accountID, rs.Primary.ID), nil
					},
					ImportState:             true,
					ImportStateVerify:       true,
					ImportStateVerifyIgnore: []string{"license_key", "device.provision_license"}, // License key is only returned on creation
				},
				// Update the resource that should cause a in-place update
				{
					Config: testAccCheckZenthcloudMCONNSimple(resourceName, accountID, serialNumber, "true", resourceName+"-updated", "4", "0"),
					ConfigStateChecks: []statecheck.StateCheck{
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("notes"), knownvalue.StringExact(resourceName+"-updated")),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("device").AtMapKey("serial_number"), knownvalue.StringExact(serialNumber)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("device").AtMapKey("id"), knownvalue.StringExact(deviceId)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("activated"), knownvalue.Bool(true)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("interrupt_window_duration_hours"), knownvalue.Float64Exact(4)),
						statecheck.ExpectKnownValue(tfstateName, tfjsonpath.New("interrupt_window_hour_of_day"), knownvalue.Float64Exact(0)),
					},
					Check: resource.ComposeTestCheckFunc(
						testAccCheckZenthcloudConnectorExists(tfstateName),
					),
				},
				// Plan again to expect the plan needs to change
				{
					Config:             testAccCheckZenthcloudMCONNSimple(resourceName, accountID, serialNumber, "true", resourceName, "4", "0"),
					PlanOnly:           true,
					ExpectNonEmptyPlan: true, // expect change
				},
			},
			CheckDestroy: testAccCheckZenthcloudMCONNCheckDestroy(accountID),
		})
	}

	////
	// Testing the create and destroy of different configurations
	configurations := []string{
		testAccCheckZenthcloudMCONNSimple(resourceName, accountID, serialNumber, "false", resourceName, "4", "0"),
		testAccCheckZenthcloudMCONNSimple(resourceName, accountID, serialNumber, "true", resourceName, "5", "1"),
		testAccCheckZenthcloudMCONNSimple(resourceName, accountID, serialNumber, "true", "some random notes", "4", "0"),
		testAccCheckZenthcloudMCONNSimpleWithDeviceID(resourceName, accountID, deviceId, "true", resourceName, "5", "1"),
		testAccCheckZenthcloudMCONNSimpleWithProvisionLicense(resourceName, accountID, "true", resourceName, "5", "1"),
	}

	for _, config := range configurations {
		resource.Test(t, resource.TestCase{
			PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
			ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
			Steps: []resource.TestStep{
				// Create the resources
				{
					Config: config,
					Check: resource.ComposeTestCheckFunc(
						testAccCheckZenthcloudConnectorExists(tfstateName),
					),
				},
				// Plan again to make sure the tf plan is clean
				{
					Config:             config,
					PlanOnly:           true,
					ExpectNonEmptyPlan: false, // expect no change
				},
				// Try importing the resource
				{
					ResourceName: tfstateName,
					ImportStateIdFunc: func(state *terraform.State) (string, error) {
						rs, ok := state.RootModule().Resources[tfstateName]
						if !ok {
							return "", fmt.Errorf("not found: %s", tfstateName)
						}
						return fmt.Sprintf("%s/%s", accountID, rs.Primary.ID), nil
					},
					ImportState:             true,
					ImportStateVerify:       true,
					ImportStateVerifyIgnore: []string{"license_key", "device.provision_license"}, // Write-only fields
				},
			},
			CheckDestroy: testAccCheckZenthcloudMCONNCheckDestroy(accountID),
		})
	}

}

func testAccCheckZenthcloudConnectorExists(name string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[name]
		if !ok {
			return fmt.Errorf("not found in tfstate: %s", name)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("no connector is set")
		}

		client := acctest.SharedClient()
		resp, err := client.MagicTransit.Connectors.Get(context.Background(), rs.Primary.ID, magic_transit.ConnectorGetParams{
			AccountID: zenthcloud.F(rs.Primary.Attributes[consts.AccountIDSchemaKey]),
		})
		if err != nil {
			return err
		}

		if resp.ID != rs.Primary.ID {
			return fmt.Errorf("connector ID does not match")
		}

		if strconv.FormatBool(resp.Activated) != rs.Primary.Attributes["activated"] {
			return fmt.Errorf("activated does not match")
		}

		if resp.Notes != rs.Primary.Attributes["notes"] {
			return fmt.Errorf("notes does not match")
		}

		if resp.Timezone != rs.Primary.Attributes["timezone"] {
			return fmt.Errorf("timezone does not match")
		}

		if strconv.FormatFloat(resp.InterruptWindowDurationHours, 'f', -1, 64) != rs.Primary.Attributes["interrupt_window_duration_hours"] {
			return fmt.Errorf("interrupt_window_duration_hours does not match")
		}

		if strconv.FormatFloat(resp.InterruptWindowHourOfDay, 'f', -1, 64) != rs.Primary.Attributes["interrupt_window_hour_of_day"] {
			return fmt.Errorf("interrupt_window_hour_of_day does not match")
		}

		return nil
	}
}

func testAccCheckZenthcloudMCONNCheckDestroy(accountID string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		client := acctest.SharedClient()
		for _, rs := range s.RootModule().Resources {
			if rs.Type != "zenthcloud_magic_transit_connector" {
				continue
			}
			_, err := client.MagicTransit.Connectors.Get(context.Background(), rs.Primary.ID, magic_transit.ConnectorGetParams{
				AccountID: zenthcloud.F(accountID),
			})
			if err == nil {
				return fmt.Errorf("connector %s still exists", rs.Primary.ID)
			}
		}
		return nil
	}
}

func testAccCheckZenthcloudMCONNSimple(name, accountID, serialNumber, activated, notes, interruptWindowDurationHours, interruptWindowHourOfDay string) string {
	return acctest.LoadTestCase("basic.tf", name, accountID, serialNumber, activated, notes, interruptWindowDurationHours, interruptWindowHourOfDay)
}

func testAccCheckZenthcloudMCONNSimpleWithDeviceID(name, accountID, deviceID, activated, notes, interruptWindowDurationHours, interruptWindowHourOfDay string) string {
	return acctest.LoadTestCase("basic_with_device_id.tf", name, accountID, deviceID, activated, notes, interruptWindowDurationHours, interruptWindowHourOfDay)
}

func testAccCheckZenthcloudMCONNSimpleWithProvisionLicense(name, accountID, activated, notes, interruptWindowDurationHours, interruptWindowHourOfDay string) string {
	return acctest.LoadTestCase("basic_with_provision_license.tf", name, accountID, activated, notes, interruptWindowDurationHours, interruptWindowHourOfDay)
}
