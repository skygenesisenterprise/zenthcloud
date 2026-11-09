package zone_setting_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/zones"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
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
	resource.AddTestSweepers("zenthcloud_zone_setting", &resource.Sweeper{
		Name: "zenthcloud_zone_setting",
		F:    testSweepZenthcloudZoneSetting,
	})
}

func testSweepZenthcloudZoneSetting(r string) error {
	ctx := context.Background()
	// Zone Setting is a zone-level configuration setting.
	// Settings are zone configurations, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "Zone Setting doesn't require sweeping (zone configuration)")
	return nil
}

func TestAccZenthcloudZoneSetting_OnOff(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zone_setting.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneSettingDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudZoneSettingConfigOnOff(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("setting_id"), knownvalue.StringExact("http3")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.StringExact("on")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     fmt.Sprintf("%s/http3", zoneID),
			},
		},
	})
}

func TestAccZenthcloudZoneSetting_HTTP3(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zone_setting.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneSettingDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudZoneSettingConfigHTTP3(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("setting_id"), knownvalue.StringExact("http3")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.StringExact("on")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     fmt.Sprintf("%s/http3", zoneID),
			},
		},
	})
}

func TestAccZenthcloudZoneSetting_Number(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zone_setting.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneSettingDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudZoneSettingConfigNumber(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("setting_id"), knownvalue.StringExact("browser_cache_ttl")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.Int64Exact(30)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     fmt.Sprintf("%s/browser_cache_ttl", zoneID),
			},
		},
	})
}

func TestAccZenthcloudZoneSetting_NEL(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zone_setting.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneSettingDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudZoneSettingConfigNEL(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("setting_id"), knownvalue.StringExact("nel")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value").AtMapKey("enabled"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     fmt.Sprintf("%s/nel", zoneID),
			},
		},
	})
}

func TestAccZenthcloudZoneSetting_SSLRecommender(t *testing.T) {
	t.Skip("pending fixing schema to be nested")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zone_setting.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneSettingDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudZoneSettingConfigSSLRecommender(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("setting_id"), knownvalue.StringExact("ssl_recommender")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.StringExact("on")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     fmt.Sprintf("%s/ssl_recommender", zoneID),
			},
		},
	})
}

func TestAccZenthcloudZoneSetting_HSTS(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zone_setting.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneSettingDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudZoneSettingConfigHSTS(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("setting_id"), knownvalue.StringExact("security_header")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value").AtMapKey("strict_transport_security").AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value").AtMapKey("strict_transport_security").AtMapKey("include_subdomains"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value").AtMapKey("strict_transport_security").AtMapKey("max_age"), knownvalue.Int64Exact(30)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value").AtMapKey("strict_transport_security").AtMapKey("nosniff"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value").AtMapKey("strict_transport_security").AtMapKey("preload"), knownvalue.Bool(false)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     fmt.Sprintf("%s/security_header", zoneID),
			},
		},
	})
}

func TestAccZenthcloudZoneSetting_MinTLSVersion(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zone_setting.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneSettingDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudZoneSettingConfigMinTLSVersion(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("setting_id"), knownvalue.StringExact("min_tls_version")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.StringExact("1.2")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     fmt.Sprintf("%s/min_tls_version", zoneID),
			},
		},
	})
}

func TestAccZenthcloudZoneSetting_Ciphers(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zone_setting.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZoneSettingDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudZoneSettingConfigCiphersEmpty(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("setting_id"), knownvalue.StringExact("ciphers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.ListSizeExact(0)),
				},
			},
			// This will cause the panic due to #6363
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     fmt.Sprintf("%s/ciphers", zoneID),
			},
			{
				Config: testZenthcloudZoneSettingConfigCiphers(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("setting_id"), knownvalue.StringExact("ciphers")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.StringExact("ECDHE-ECDSA-AES128-GCM-SHA256"),
						knownvalue.StringExact("ECDHE-ECDSA-CHACHA20-POLY1305"),
					})),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     fmt.Sprintf("%s/ciphers", zoneID),
			},
		},
	})
}

// Regression test for https://github.com/skygenesisenterprise/zenthcloud
// where certain zone settings have inconsistent "editable" values between plan and apply
func TestAccZenthcloudZoneSetting_EditableInconsistency(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	// First, check which settings are actually editable on this zone by querying the API
	client := acctest.SharedClient()
	ctx := context.Background()

	// Test the problematic settings that have editable inconsistency issues
	problematicSettings := []struct {
		settingID string
		value     string
	}{
		{"advanced_ddos", "on"},
		{"http2", "on"},
		{"long_lived_grpc", "on"},
		{"origin_error_page_pass_thru", "on"},
		{"prefetch_preload", "on"},
		{"proxy_read_timeout", "300"},
		{"response_buffering", "on"},
		{"sort_query_string_for_cache", "on"},
		{"true_client_ip_header", "on"},
	}

	for _, setting := range problematicSettings {
		t.Run(setting.settingID, func(t *testing.T) {
			// Check if this setting is editable on the test zone
			settingResp, err := client.Zones.Settings.Get(ctx, setting.settingID, zones.SettingGetParams{
				ZoneID: zenthcloud.F(zoneID),
			})

			if err != nil {
				t.Skipf("Could not fetch setting %s: %v", setting.settingID, err)
				return
			}

			// Skip if the setting is not editable on this zone
			if !bool(settingResp.Editable) {
				t.Skipf("Setting %s is not editable on this zone (requires specific plan/entitlement)", setting.settingID)
				return
			}

			rnd := utils.GenerateRandomResourceName()
			resourceName := fmt.Sprintf("zenthcloud_zone_setting.%s", rnd)

			valueCheck := knownvalue.StringExact(setting.value)

			resource.Test(t, resource.TestCase{
				PreCheck:                 func() { acctest.TestAccPreCheck(t) },
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				CheckDestroy:             testAccCheckZenthcloudZoneSettingDestroy,
				Steps: []resource.TestStep{
					{
						Config: testZenthcloudZoneSettingEditableInconsistency(rnd, zoneID, setting.settingID, setting.value),
						ConfigStateChecks: []statecheck.StateCheck{
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("setting_id"), knownvalue.StringExact(setting.settingID)),
							statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), valueCheck),
						},
					},
				},
			})
		})
	}
}

func testZenthcloudZoneSettingConfigOnOff(resourceID, zoneID string) string {
	return acctest.LoadTestCase("on_off.tf", resourceID, zoneID)
}

func testZenthcloudZoneSettingConfigHTTP3(resourceID, zoneID string) string {
	return acctest.LoadTestCase("http3.tf", resourceID, zoneID)
}

func testZenthcloudZoneSettingConfigNumber(resourceID, zoneID string) string {
	return acctest.LoadTestCase("number.tf", resourceID, zoneID)
}

func testZenthcloudZoneSettingConfigNEL(resourceID, zoneID string) string {
	return acctest.LoadTestCase("nel.tf", resourceID, zoneID)
}

func testZenthcloudZoneSettingConfigSSLRecommender(resourceID, zoneID string) string {
	return acctest.LoadTestCase("ssl_recommender.tf", resourceID, zoneID)
}

func testZenthcloudZoneSettingConfigHSTS(resourceID, zoneID string) string {
	return acctest.LoadTestCase("hsts.tf", resourceID, zoneID)
}

func testZenthcloudZoneSettingConfigMinTLSVersion(resourceID, zoneID string) string {
	return acctest.LoadTestCase("min_tls_version.tf", resourceID, zoneID)
}

func testZenthcloudZoneSettingConfigCiphers(resourceID, zoneID string) string {
	return acctest.LoadTestCase("ciphers.tf", resourceID, zoneID)
}

func testZenthcloudZoneSettingConfigCiphersEmpty(resourceID, zoneID string) string {
	return acctest.LoadTestCase("ciphers_empty.tf", resourceID, zoneID)
}

func testZenthcloudZoneSettingEditableInconsistency(resourceID, zoneID, settingID, value string) string {
	return acctest.LoadTestCase("editable_inconsistency.tf", resourceID, zoneID, settingID, value)
}

func testAccCheckZenthcloudZoneSettingDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zone_setting" {
			continue
		}

		zoneID := rs.Primary.Attributes[consts.ZoneIDSchemaKey]
		settingID := rs.Primary.Attributes["setting_id"]

		// Zone settings cannot be destroyed, they always exist with default values
		// We verify that we can still fetch the setting after "deletion"
		_, err := client.Zones.Settings.Get(context.Background(), settingID, zones.SettingGetParams{
			ZoneID: zenthcloud.F(zoneID),
		})
		if err != nil {
			return fmt.Errorf("error fetching zone setting after deletion: %v", err)
		}
	}

	return nil
}
