package custom_pages_test

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
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_custom_pages", &resource.Sweeper{
		Name: "zenthcloud_custom_pages",
		F:    testSweepZenthcloudCustomPages,
	})
}

func testSweepZenthcloudCustomPages(r string) error {
	ctx := context.Background()
	// Custom pages are zone/account-level settings for error and challenge pages.
	// They don't create separate resources that accumulate over time - they just
	// configure predefined page types (like 500_errors, basic_challenge, etc.).
	// No sweeping required as there are no resources to clean up.
	tflog.Info(ctx, "Custom pages don't require sweeping (configuration settings)")
	return nil
}

// NOTE: https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/ is used for all custom page types
// that require a ::CF_WIDGET_BOX:: (including country and IP challenges), not just for waf challenges

// Test account-level custom pages with basic configuration
func TestAccZenthcloudCustomPages_AccountBasic(t *testing.T) {
	t.Skip(`Skipped: 403 Forbidden {"success":false,"errors":[{"code":1002,"message":"Forbidden. Account creation is not allowed"}],"messages":[],"result":null}`)
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesAccountConfig(rnd, accountID, "basic_challenge", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("basic_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesAccountConfig(rnd, accountID, "basic_challenge", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("basic_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test zone-level custom pages with basic configuration
func TestAccZenthcloudCustomPages_ZoneBasic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "500_errors", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("500_errors")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "500_errors", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("500_errors")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

func TestAccZenthcloudCustomPages_ZoneCustomized(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "500_errors", "customized", "https://custom-pages-basic.terraform-provider-acceptance-testing.workers.dev/"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("500_errors")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("customized")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("https://custom-pages-basic.terraform-provider-acceptance-testing.workers.dev/")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "500_errors", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("500_errors")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test account-level custom pages with customized state
func TestAccZenthcloudCustomPages_AccountCustomized(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesAccountConfig(rnd, accountID, "waf_block", "customized", "https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("waf_block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("customized")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesAccountConfig(rnd, accountID, "waf_block", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("waf_block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test account-level custom pages with multiple page types
func TestAccZenthcloudCustomPages_AccountMultiplePages(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName1 := "zenthcloud_custom_pages." + rnd + "_challenge"
	resourceName2 := "zenthcloud_custom_pages." + rnd + "_block"

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesAccountMultipleConfig(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					// Challenge page checks
					statecheck.ExpectKnownValue(resourceName1, tfjsonpath.New("identifier"), knownvalue.StringExact("waf_block")),
					statecheck.ExpectKnownValue(resourceName1, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName1, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName1, tfjsonpath.New("url"), knownvalue.StringExact("")),
					// Block page checks
					statecheck.ExpectKnownValue(resourceName2, tfjsonpath.New("identifier"), knownvalue.StringExact("waf_block")),
					statecheck.ExpectKnownValue(resourceName2, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName2, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName2, tfjsonpath.New("url"), knownvalue.StringExact("")),
				},
			},
			{
				ResourceName:            resourceName1,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
			{
				ResourceName:            resourceName2,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test zone-level custom page with ip_block identifier
func TestAccZenthcloudCustomPages_ZoneIpBlock(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "ip_block", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("ip_block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "ip_block", "customized", "https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("ip_block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("customized")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test zone-level custom page with country_challenge identifier
func TestAccZenthcloudCustomPages_ZoneCountryChallenge(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "country_challenge", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("country_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "country_challenge", "customized", "https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("country_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("customized")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test zone-level custom page with 1000_errors identifier
func TestAccZenthcloudCustomPages_Zone1000Errors(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "1000_errors", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("1000_errors")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "1000_errors", "customized", "https://custom-pages-1000-errors.terraform-provider-acceptance-testing.workers.dev/"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("1000_errors")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("customized")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("https://custom-pages-1000-errors.terraform-provider-acceptance-testing.workers.dev/")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test zone-level custom page with managed_challenge identifier
func TestAccZenthcloudCustomPages_ZoneManagedChallenge(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "managed_challenge", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("managed_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "managed_challenge", "customized", "https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("managed_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("customized")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test zone-level custom page with ratelimit_block identifier
func TestAccZenthcloudCustomPages_ZoneRatelimitBlock(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "ratelimit_block", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("ratelimit_block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.Null()),
				},
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: acctest.LogResourceDrift,
				},
			},
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "ratelimit_block", "customized", "https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("ratelimit_block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("customized")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test account-level custom page with basic_challenge identifier (customized)
func TestAccZenthcloudCustomPages_AccountBasicChallengeCustomized(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesAccountConfig(rnd, accountID, "basic_challenge", "customized", "https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("basic_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("customized")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesAccountConfig(rnd, accountID, "basic_challenge", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("basic_challenge")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test zone-level custom page with waf_block identifier (customized)
func TestAccZenthcloudCustomPages_ZoneWafBlockCustomized(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "waf_block", "customized", "https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("waf_block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("customized")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "waf_block", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("waf_block")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

// Test zone-level custom page with under_attack identifier (customized)
func TestAccZenthcloudCustomPages_ZoneUnderAttackCustomized(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_custom_pages." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "under_attack", "customized", "https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("under_attack")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("customized")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("https://custom-pages-waf-challenge.terraform-provider-acceptance-testing.workers.dev/")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.Null()),
				},
			},
			{
				Config: testAccCustomPagesZoneConfig(rnd, zoneID, "under_attack", "default", ""),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("identifier"), knownvalue.StringExact("under_attack")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("state"), knownvalue.StringExact("default")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("url"), knownvalue.StringExact("")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"state", "url"},
			},
		},
	})
}

func testAccCustomPagesAccountConfig(rnd, accountID, identifier, state, url string) string {
	return acctest.LoadTestCase("account_basic.tf", rnd, accountID, identifier, state, url)
}

func testAccCustomPagesZoneConfig(rnd, zoneID, identifier, state, url string) string {
	return acctest.LoadTestCase("zone_basic.tf", rnd, zoneID, identifier, state, url)
}

func testAccCustomPagesAccountMultipleConfig(rnd, accountID string) string {
	return acctest.LoadTestCase("account_multiple.tf", rnd, accountID)
}

func TestAccUpgradeCustomPages_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	config := testAccCustomPagesAccountConfig(rnd, accountID, "basic_challenge", "default", "")

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
