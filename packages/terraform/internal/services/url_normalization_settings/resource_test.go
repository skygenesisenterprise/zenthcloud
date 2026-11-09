package url_normalization_settings_test

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/url_normalization"
	"github.com/hashicorp/terraform-plugin-log/tflog"

	zenthcloud "github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_url_normalization_settings", &resource.Sweeper{
		Name: "zenthcloud_url_normalization_settings",
		F:    testSweepZenthcloudURLNormalizationSettings,
	})
}

func testSweepZenthcloudURLNormalizationSettings(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping URL normalization settings sweep: ZENTHCLOUD_ZONE_ID not set")
		return nil
	}

	settings, err := client.URLNormalization.Get(ctx, url_normalization.URLNormalizationGetParams{
		ZoneID: zenthcloud.F(zoneID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch URL normalization settings: %s", err))
		return err
	}

	if settings == nil {
		tflog.Info(ctx, "No URL normalization settings to sweep")
		return nil
	}

	tflog.Info(ctx, fmt.Sprintf("Deleting URL normalization settings (zone: %s)", zoneID))
	err = client.URLNormalization.Delete(ctx, url_normalization.URLNormalizationDeleteParams{
		ZoneID: zenthcloud.F(zoneID),
	})

	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to delete URL normalization settings: %s", err))
		return err
	}

	tflog.Info(ctx, "Deleted URL normalization settings")
	return nil
}

func TestAccZenthcloudURLNormalizationSettings_CreateThenUpdate(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_url_normalization_settings.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "zenthcloud", "incoming", rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("zenthcloud")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scope"), knownvalue.StringExact("incoming")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     zoneID,
			},
			{
				Config: testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "zenthcloud", "both", rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("zenthcloud")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scope"), knownvalue.StringExact("both")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     zoneID,
			},
		},
	})
}

func TestAccZenthcloudURLNormalizationSettings_AllCombinations(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_url_normalization_settings.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,

		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "zenthcloud", "incoming", rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("zenthcloud")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scope"), knownvalue.StringExact("incoming")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     zoneID,
			},
			{
				Config: testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "zenthcloud", "both", rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("zenthcloud")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scope"), knownvalue.StringExact("both")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     zoneID,
			},
			{
				Config: testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "rfc3986", "incoming", rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("rfc3986")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scope"), knownvalue.StringExact("incoming")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     zoneID,
			},
			{
				Config: testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "rfc3986", "both", rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("rfc3986")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scope"), knownvalue.StringExact("both")),
				},
			},
		},
	})
}

func TestAccZenthcloudURLNormalizationSettings_InvalidValues(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "invalid_type", "incoming", rnd),
				ExpectError: regexp.MustCompile(`value must be one of: \["zenthcloud" "rfc3986"\]`),
			},
			{
				Config:      testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "zenthcloud", "invalid_scope", rnd),
				ExpectError: regexp.MustCompile(`value must be one of: \["incoming"|"none"|"both"\]`),
			},
		},
	})
}

func TestAccZenthcloudURLNormalizationSettings_CreateThenDelete(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_url_normalization_settings.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "zenthcloud", "incoming", rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("zenthcloud")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scope"), knownvalue.StringExact("incoming")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     zoneID,
			},
			{
				Config: testAccCheckZenthcloudURLNormalizationSettingsConfigEmpty(zoneID, rnd),
			},
		},
	})
}

func TestAccZenthcloudURLNormalizationSettings_NoneScope(t *testing.T) {

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_url_normalization_settings.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "zenthcloud", "none", rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("zenthcloud")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scope"), knownvalue.StringExact("none")),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     zoneID,
			},
		},
	})
}

func testAccCheckZenthcloudURLNormalizationSettingsConfigEmpty(zoneID, name string) string {
	return acctest.LoadTestCase("urlnormalizationsettingsconfig_empty.tf", zoneID, name)
}

func testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, _type, scope, name string) string {
	return acctest.LoadTestCase("urlnormalizationsettingsconfig.tf", zoneID, _type, scope, name)
}

func TestAccUpgradeUrlNormalizationSettings_FromPublishedV5(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()

	config := testAccCheckZenthcloudURLNormalizationSettingsConfig(zoneID, "zenthcloud", "incoming", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() { acctest.TestAccPreCheck(t) },
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
