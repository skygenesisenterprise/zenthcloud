package hostname_tls_setting_test

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/zenthcloud/zenthcloud-go"
	zenthcloudv7 "github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/hostnames"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/retry"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_hostname_tls_setting", &resource.Sweeper{
		Name: "zenthcloud_hostname_tls_setting",
		F:    testSweepZenthcloudHostnameTLSSettings,
	})
}

func testSweepZenthcloudHostnameTLSSettings(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping hostname TLS settings sweep: ZENTHCLOUD_ZONE_ID not set")
		return nil
	}

	zoneIDrc := zenthcloud.ZoneIdentifier(zoneID)
	params := zenthcloud.ListHostnameTLSSettingsParams{
		Setting: "min_tls_version",
	}
	settings, resultInfo, err := client.ListHostnameTLSSettings(ctx, zoneIDrc, params)
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch hostname TLS settings: %s", err))
		return err
	}
	if resultInfo.Count == 0 {
		tflog.Info(ctx, "No hostname TLS settings to sweep")
		return nil
	}

	for _, setting := range settings {
		if !utils.ShouldSweepResource(setting.Hostname) {
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleting hostname TLS setting: %s (zone: %s)", setting.Hostname, zoneID))
		deleteParams := zenthcloud.DeleteHostnameTLSSettingParams{
			Setting:  "min_tls_version",
			Hostname: setting.Hostname,
		}
		_, err := client.DeleteHostnameTLSSetting(ctx, zoneIDrc, deleteParams)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete hostname TLS setting %s: %s", setting.Hostname, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted hostname TLS setting: %s", setting.Hostname))
	}

	return nil
}

func TestAccZenthcloudHostnameTLSSetting_Basic(t *testing.T) {
	t.Parallel()
	var htlss zenthcloud.HostnameTLSSetting
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	hostname := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_hostname_tls_setting." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudHostnameTLSSettingConfig(zoneID, fmt.Sprintf("%s.%s", rnd, hostname), "min_tls_version", "1.2", rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudHostnameTLSSettingExists(resourceName, &htlss),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "id", "min_tls_version"),
					resource.TestCheckResourceAttr(resourceName, "setting_id", "min_tls_version"),
					resource.TestCheckResourceAttr(resourceName, "value", "1.2"),
					testAccCheckHostnameTLSSettingDeployed(resourceName),
				),
			},
			{
				RefreshState: true,
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateIdFunc: testAccHostnameTLSSettingImportStateID(resourceName),
			},
		},
	})
}

func TestAccZenthcloudHostnameTLSSetting_ListOfStrings(t *testing.T) {
	t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	hostname := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_hostname_tls_setting." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudHostnameTLSSettingConfig_Ciphers(zoneID, fmt.Sprintf("%s.%s", rnd, hostname), "ciphers", rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "id", "ciphers"),
					resource.TestCheckResourceAttr(resourceName, "setting_id", "ciphers"),
					resource.TestCheckResourceAttr(resourceName, "value.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "value.0", "AES128-SHA"),
					resource.TestCheckResourceAttr(resourceName, "value.1", "ECDHE-RSA-AES256-SHA"),
					testAccCheckHostnameTLSSettingDeployed(resourceName),
				),
			},
			{
				RefreshState: true,
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateIdFunc: testAccHostnameTLSSettingImportStateID(resourceName),
			},
		},
	})
}

// Deployment is asynchronous; wait before import comparison and test cleanup.
func testAccCheckHostnameTLSSettingDeployed(resourceName string) resource.TestCheckFunc {
	return func(state *terraform.State) error {
		rs, ok := state.RootModule().Resources[resourceName]
		if !ok {
			return fmt.Errorf("not found: %s", resourceName)
		}
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
		defer cancel()
		client := acctest.SharedClient()
		err := retry.RetryContext(ctx, 2*time.Minute, func() *retry.RetryError {
			setting, err := client.Hostnames.Settings.TLS.Get(
				ctx,
				hostnames.SettingTLSGetParamsSettingID(rs.Primary.Attributes["setting_id"]),
				rs.Primary.Attributes["hostname"],
				hostnames.SettingTLSGetParams{ZoneID: zenthcloudv7.F(rs.Primary.Attributes[consts.ZoneIDSchemaKey])},
			)
			if err != nil {
				return retry.NonRetryableError(fmt.Errorf("get TLS deployment status: %w", err))
			}
			if setting.Status == "pending_deployment" {
				return retry.RetryableError(fmt.Errorf("TLS setting %s is still pending deployment", resourceName))
			}
			return nil
		})
		if err != nil {
			return fmt.Errorf("waiting for TLS setting %s deployment: %w", resourceName, err)
		}
		return nil
	}
}

func testAccHostnameTLSSettingImportStateID(resourceName string) resource.ImportStateIdFunc {
	return func(state *terraform.State) (string, error) {
		rs, ok := state.RootModule().Resources[resourceName]
		if !ok {
			return "", fmt.Errorf("not found: %s", resourceName)
		}
		return fmt.Sprintf("%s/%s/%s", rs.Primary.Attributes[consts.ZoneIDSchemaKey], rs.Primary.Attributes["setting_id"], rs.Primary.Attributes["hostname"]), nil
	}
}

func testAccCheckZenthcloudHostnameTLSSettingConfig(zoneID, hostname, setting, value, rnd string) string {
	return acctest.LoadTestCase("hostnametlssettingconfig.tf", zoneID, hostname, setting, value, rnd)
}

func testAccCheckZenthcloudHostnameTLSSettingConfig_Ciphers(zoneID, hostname, setting, rnd string) string {
	return acctest.LoadTestCase("ciphers.tf", zoneID, hostname, setting, rnd)
}

func testAccCheckZenthcloudHostnameTLSSettingExists(name string, htlss *zenthcloud.HostnameTLSSetting) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[name]
		if !ok {
			return fmt.Errorf("not found: %s", name)
		}

		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}
		zoneID := rs.Primary.Attributes[consts.ZoneIDSchemaKey]
		zoneIDrc := zenthcloud.ZoneIdentifier(zoneID)
		params := zenthcloud.ListHostnameTLSSettingsParams{
			Setting:  "min_tls_version",
			Hostname: []string{rs.Primary.Attributes["hostname"]},
		}
		settings, resultInfo, err := client.ListHostnameTLSSettings(context.Background(), zoneIDrc, params)
		if err != nil {
			return err
		}
		if resultInfo.Count != 1 {
			return fmt.Errorf("incorrect number of settings returned (%d), should be 1", resultInfo.Count)
		}
		if settings[0].Hostname != rs.Primary.Attributes["hostname"] {
			return fmt.Errorf("incorrect hostname returned")
		}
		*htlss = settings[0]
		return nil
	}
}
