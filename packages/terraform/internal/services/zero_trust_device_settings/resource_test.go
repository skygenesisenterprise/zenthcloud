package zero_trust_device_settings_test

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
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_device_settings", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_device_settings",
		F:    testSweepZenthcloudZeroTrustDeviceSettings,
	})
}

func testSweepZenthcloudZeroTrustDeviceSettings(r string) error {
	ctx := context.Background()
	// Device Settings is an account-level device configuration setting.
	// It's a singleton setting per account, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "Zero Trust Device Settings doesn't require sweeping (account setting)")
	return nil
}

func TestAccZenthcloudZTDeviceSettings(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_device_settings.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsDeviceSettingsDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZTDeviceSettings(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "disable_for_time", "20"),
					resource.TestCheckResourceAttr(name, "gateway_proxy_enabled", "true"),
					resource.TestCheckResourceAttr(name, "gateway_udp_proxy_enabled", "true"),
					resource.TestCheckResourceAttr(name, "root_certificate_installation_enabled", "true"),
					resource.TestCheckResourceAttr(name, "use_zt_virtual_ip", "true"),
				),
			},
			{
				Config: testAccZenthcloudZTDeviceSomeSettings(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "disable_for_time", "0"),
					resource.TestCheckResourceAttr(name, "gateway_proxy_enabled", "true"),
					resource.TestCheckResourceAttr(name, "gateway_udp_proxy_enabled", "false"),
					resource.TestCheckResourceAttr(name, "root_certificate_installation_enabled", "false"),
					resource.TestCheckResourceAttr(name, "use_zt_virtual_ip", "true"),
				),
			},
		},
	})
}

func testAccZenthcloudZTDeviceSettings(rnd, accountID string) string {
	return acctest.LoadTestCase("zt_device_settings_init.tf", rnd, accountID)
}

func testAccZenthcloudZTDeviceSomeSettings(rnd, accountID string) string {
	return acctest.LoadTestCase("zt_device_settings_update.tf", rnd, accountID)
}

func testAccCheckZenthcloudTeamsDeviceSettingsDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_device_settings" {
			continue
		}

		settings, err := client.TeamsAccountDeviceConfiguration(context.Background(), rs.Primary.Attributes[consts.AccountIDSchemaKey])
		if err != nil || settings.GatewayProxyEnabled {
			return fmt.Errorf("teams device settings still exists")
		}
	}

	return nil
}
