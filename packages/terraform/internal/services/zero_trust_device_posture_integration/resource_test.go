package zero_trust_device_posture_integration_test

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
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_device_posture_integration", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_device_posture_integration",
		F:    testSweepZenthcloudZeroTrustDevicePostureIntegration,
	})
}

func testSweepZenthcloudZeroTrustDevicePostureIntegration(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client()
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	integrations, _, err := client.DevicePostureIntegrations(ctx, accountID)
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zero Trust Device Posture Integrations: %s", err))
		return err
	}

	for _, integration := range integrations {
		if !utils.ShouldSweepResource(integration.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting Zero Trust Device Posture Integration: %s", integration.IntegrationID))
		err := client.DeleteDevicePostureIntegration(ctx, accountID, integration.IntegrationID)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete Zero Trust Device Posture Integration %s: %s", integration.IntegrationID, err))
		}
	}

	return nil
}

func TestAccZenthcloudDevicePostureIntegrationCreate(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_device_posture_integration.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	clientID := os.Getenv("ZENTHCLOUD_CROWDSTRIKE_CLIENT_ID")
	clientSecret := os.Getenv("ZENTHCLOUD_CROWDSTRIKE_CLIENT_SECRET")
	apiURL := os.Getenv("ZENTHCLOUD_CROWDSTRIKE_API_URL")
	customerId := os.Getenv("ZENTHCLOUD_CROWDSTRIKE_CUSTOMER_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_CrowdStrike(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudDevicePostureIntegrationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudDevicePostureIntegration(rnd, accountID, clientID, clientSecret, apiURL, customerId),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("type"), knownvalue.StringExact("crowdstrike_s2s")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("interval"), knownvalue.StringExact("24h")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("config").AtMapKey("api_url"), knownvalue.StringExact(apiURL)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("config").AtMapKey("client_id"), knownvalue.StringExact(clientID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("config").AtMapKey("customer_id"), knownvalue.StringExact(customerId)),
				},
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"config.client_secret", "config.customer_id"},
			},
		},
	})
}

func testAccZenthcloudDevicePostureIntegration(rnd, accountID, clientID, clientSecret, apiURL, customerId string) string {
	return acctest.LoadTestCase("devicepostureintegration.tf", rnd, accountID, clientID, clientSecret, apiURL, customerId)
}

func testAccCheckZenthcloudDevicePostureIntegrationDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_device_posture_integration" {
			continue
		}

		_, err := client.DevicePostureIntegration(context.Background(), rs.Primary.Attributes[consts.AccountIDSchemaKey], rs.Primary.ID)
		if err == nil {
			return fmt.Errorf("Device Posture Integration still exists")
		}
	}

	return nil
}

func TestAccUpgradeZeroTrustDevicePostureIntegration_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	clientID := os.Getenv("ZENTHCLOUD_CROWDSTRIKE_CLIENT_ID")
	clientSecret := os.Getenv("ZENTHCLOUD_CROWDSTRIKE_CLIENT_SECRET")
	apiURL := os.Getenv("ZENTHCLOUD_CROWDSTRIKE_API_URL")
	customerId := os.Getenv("ZENTHCLOUD_CROWDSTRIKE_CUSTOMER_ID")

	config := testAccZenthcloudDevicePostureIntegration(rnd, accountID, clientID, clientSecret, apiURL, customerId)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_CrowdStrike(t)
		},
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.16.0",
					},
				},
				Config: config,
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
