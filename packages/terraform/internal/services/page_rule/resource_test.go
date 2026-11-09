package page_rule_test

import (
	"context"

	"fmt"
	"os"
	"regexp"
	"testing"

	zenthcloud "github.com/skygenesisenterprise/zenthcloud/zenthcloud-go"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

var (
	domain = os.Getenv("ZENTHCLOUD_DOMAIN")
)

func init() {
	resource.AddTestSweepers("zenthcloud_page_rule", &resource.Sweeper{
		Name: "zenthcloud_page_rule",
		F:    testSweepZenthcloudPageRules,
	})
}

func testSweepZenthcloudPageRules(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	altZoneID := os.Getenv("ZENTHCLOUD_ALT_ZONE_ID")

	if zoneID == "" || altZoneID == "" {
		tflog.Info(ctx, "Skipping page rules sweep: ZENTHCLOUD_ZONE_ID and ZENTHCLOUD_ALT_ZONE_ID must be set")
		return nil
	}

	pageRules, err := client.ListPageRules(ctx, zoneID)
	if err != nil {
		// If the zone doesn't exist or is invalid, just log and continue (don't fail the sweep)
		tflog.Warn(ctx, fmt.Sprintf("Failed to fetch page rules for zone %s: %s (skipping)", zoneID, err))
		// Continue to try the alt zone
		pageRules = []zenthcloud.PageRule{}
	}
	if len(pageRules) == 0 {
		tflog.Info(ctx, fmt.Sprintf("No page rules to sweep in zone %s", zoneID))
	} else {
		for _, pageRule := range pageRules {
			tflog.Info(ctx, fmt.Sprintf("Deleting page rule: %s (zone: %s)", pageRule.ID, zoneID))
			err := client.DeletePageRule(ctx, zoneID, pageRule.ID)
			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to delete page rule %s: %s", pageRule.ID, err))
				continue
			}
			tflog.Info(ctx, fmt.Sprintf("Deleted page rule: %s", pageRule.ID))
		}
	}
	altPageRules, err := client.ListPageRules(ctx, altZoneID)
	if err != nil {
		// If the zone doesn't exist or is invalid, just log and continue (don't fail the sweep)
		tflog.Warn(ctx, fmt.Sprintf("Failed to fetch page rules for alt zone %s: %s (skipping)", altZoneID, err))
		return nil
	}
	if len(altPageRules) == 0 {
		tflog.Info(ctx, fmt.Sprintf("No page rules to sweep in alt zone %s", altZoneID))
	} else {
		for _, pageRule := range altPageRules {

			tflog.Info(ctx, fmt.Sprintf("Deleting page rule: %s (zone: %s)", pageRule.ID, altZoneID))
			err := client.DeletePageRule(ctx, altZoneID, pageRule.ID)
			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to delete page rule %s: %s", pageRule.ID, err))
				continue
			}
			tflog.Info(ctx, fmt.Sprintf("Deleted page rule: %s", pageRule.ID))
		}
	}

	return nil
}
func TestAccZenthcloudPageRule_Basic(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				// Config: testAccCheckZenthcloudPageRuleConfigBasic(zoneID, target, rnd),
				Config: buildPageRuleConfig(rnd, zoneID, `disable_apps = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					// testAccCheckZenthcloudPageRuleAttributesBasic(&pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_apps = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					// testAccCheckZenthcloudPageRuleAttributesBasic(&pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_FullySpecified(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigFullySpecified(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigFullySpecified(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_AlwaysUseHTTPS(t *testing.T) {
	t.Skip("unable to set always_use_https")
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: buildPageRuleConfig(rnd, zoneID, `always_use_https = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.always_use_https", "true"),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `always_use_https = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.always_use_https", "true"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_DisableApps(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_apps = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_apps", "true"),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_apps = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_apps", "true"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_apps", "true"),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_apps = false`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_apps", "false"),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_apps = false`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_apps", "false"),
				),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_DisablePerformance(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_performance = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_performance", "true"),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_performance = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_performance", "true"),
				),
				PlanOnly: true,
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_performance = false`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_performance", "false"),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_performance = false`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_performance", "false"),
				),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_DisableSecurity(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_security = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_security", "true"),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_security = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_security", "true"),
				),
				PlanOnly: true,
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_security = false`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_security", "false"),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_security = false`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_security", "false"),
				),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_DisableZaraz(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_zaraz = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_zaraz", "true"),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_zaraz = true`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_zaraz", "true"),
				),
				PlanOnly: true,
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_zaraz = false`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_zaraz", "false"),
				),
			},
			{
				Config: buildPageRuleConfig(rnd, zoneID, `disable_zaraz = false`, target),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "actions.disable_zaraz", "false"),
				),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_ForwardingOnly(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigForwardingOnly(zoneID, target, rnd, rnd+"."+domain),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.forwarding_url.url", fmt.Sprintf("http://%s/forward", rnd+"."+domain)),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigForwardingOnly(zoneID, target, rnd, rnd+"."+domain),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.forwarding_url.url", fmt.Sprintf("http://%s/forward", rnd+"."+domain)),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_ForwardingAndOthers(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigForwardingAndOthers(zoneID, target, rnd, rnd+"."+domain),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", target),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
				),
				ExpectError: regexp.MustCompile(`\\"forwarding_url\\"\s+may not be used with \\"any setting\\"`),
			},
		},
	})
}

func TestAccZenthcloudPageRule_Updated(t *testing.T) {
	var before, after zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigBasic(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &before),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigBasic(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &before),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigNewValue(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &after),
					// testAccCheckZenthcloudPageRuleAttributesUpdated(&after),
					testAccCheckZenthcloudPageRuleIDUnchanged(&before, &after),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s/updated", target)),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigNewValue(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &after),
					// testAccCheckZenthcloudPageRuleAttributesUpdated(&after),
					testAccCheckZenthcloudPageRuleIDUnchanged(&before, &after),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s/updated", target)),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_CreateAfterManualDestroy(t *testing.T) {
	t.Skip("test is attempting to cleanup the page rules after running the manual delete causing failures before the next step")
	var before, after zenthcloud.PageRule
	var initialID string
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigBasic(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &before),
					testAccManuallyDeletePageRule(resourceName, &initialID),
				),
				ExpectNonEmptyPlan: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigBasic(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &before),
					testAccManuallyDeletePageRule(resourceName, &initialID),
				),
				PlanOnly: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigNewValue(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &after),
					testAccCheckZenthcloudPageRuleRecreated(&before, &after),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s/updated", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.browser_check", "on"),
					resource.TestCheckResourceAttr(resourceName, "actions.rocket_loader", "on"),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "strict"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigNewValue(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &after),
					testAccCheckZenthcloudPageRuleRecreated(&before, &after),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s/updated", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.browser_check", "on"),
					resource.TestCheckResourceAttr(resourceName, "actions.rocket_loader", "on"),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "strict"),
				),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_UpdatingZoneForcesNewResource(t *testing.T) {
	t.Skip("Skipping: automatic_https_rewrites page rule action no longer accepted by the API")
	var before, after zenthcloud.PageRule
	oldZoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	newZoneID := os.Getenv("ZENTHCLOUD_ALT_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	oldTarget := fmt.Sprintf("%s.%s", rnd, os.Getenv("ZENTHCLOUD_DOMAIN"))
	newTarget := fmt.Sprintf("%s.%s", rnd, os.Getenv("ZENTHCLOUD_ALT_DOMAIN"))

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AlternateDomain(t)
			acctest.TestAccPreCheck_AlternateZoneID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigBasic(oldZoneID, oldTarget, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &before),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, oldZoneID),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigBasic(oldZoneID, oldTarget, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &before),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, oldZoneID),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", oldZoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigBasic(newZoneID, newTarget, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &after),
					testAccCheckZenthcloudPageRuleRecreated(&before, &after),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, newZoneID),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigBasic(newZoneID, newTarget, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &after),
					testAccCheckZenthcloudPageRuleRecreated(&before, &after),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, newZoneID),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", newZoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_BrowserCheckOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "browser_check", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.browser_check", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "browser_check", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.browser_check", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "browser_check", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.browser_check", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "browser_check", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.browser_check", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_AutomaticHTTPSRewritesOnOff(t *testing.T) {
	t.Skip("API Error: Invalid setting automatic_https_rewrites")

	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "automatic_https_rewrites", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.automatic_https_rewrites", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "automatic_https_rewrites", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.automatic_https_rewrites", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "automatic_https_rewrites", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.automatic_https_rewrites", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "automatic_https_rewrites", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.automatic_https_rewrites", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheByDeviceTypeOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_by_device_type", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_by_device_type", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_by_device_type", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_by_device_type", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_by_device_type", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_by_device_type", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_by_device_type", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_by_device_type", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheDeceptionArmorOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_deception_armor", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_deception_armor", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_deception_armor", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_deception_armor", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_deception_armor", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_deception_armor", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_deception_armor", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_deception_armor", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_EmailObfuscationOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "email_obfuscation", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.email_obfuscation", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "email_obfuscation", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.email_obfuscation", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "email_obfuscation", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.email_obfuscation", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "email_obfuscation", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.email_obfuscation", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_ExplicitCacheControlOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "explicit_cache_control", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.explicit_cache_control", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "explicit_cache_control", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.explicit_cache_control", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "explicit_cache_control", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.explicit_cache_control", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "explicit_cache_control", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.explicit_cache_control", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_IPGeolocationOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ip_geolocation", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ip_geolocation", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ip_geolocation", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ip_geolocation", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ip_geolocation", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ip_geolocation", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ip_geolocation", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ip_geolocation", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_MirageOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "mirage", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.mirage", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "mirage", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.mirage", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "mirage", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.mirage", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "mirage", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.mirage", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_OpportunisticEncryptionOnOff(t *testing.T) {
	t.Skip("unable to set opportunistic encryption")
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "opportunistic_encryption", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.opportunistic_encryption", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "opportunistic_encryption", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.opportunistic_encryption", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "opportunistic_encryption", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.opportunistic_encryption", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "opportunistic_encryption", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.opportunistic_encryption", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_OriginErrorPagePassThruOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "origin_error_page_pass_thru", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.origin_error_page_pass_thru", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "origin_error_page_pass_thru", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.origin_error_page_pass_thru", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "origin_error_page_pass_thru", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.origin_error_page_pass_thru", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "origin_error_page_pass_thru", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.origin_error_page_pass_thru", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_RespectStrongEtagOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "respect_strong_etag", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.respect_strong_etag", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "respect_strong_etag", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.respect_strong_etag", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "respect_strong_etag", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.respect_strong_etag", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "respect_strong_etag", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.respect_strong_etag", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_ResponseBufferingOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "response_buffering", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.response_buffering", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "response_buffering", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.response_buffering", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "response_buffering", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.response_buffering", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "response_buffering", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.response_buffering", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_RocketLoaderOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "rocket_loader", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.rocket_loader", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "rocket_loader", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.rocket_loader", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "rocket_loader", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.rocket_loader", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "rocket_loader", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.rocket_loader", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_SortQueryStringForCacheOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "sort_query_string_for_cache", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.sort_query_string_for_cache", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "sort_query_string_for_cache", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.sort_query_string_for_cache", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "sort_query_string_for_cache", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.sort_query_string_for_cache", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "sort_query_string_for_cache", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.sort_query_string_for_cache", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_TrueClientIPHeaderOnOff(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "true_client_ip_header", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.true_client_ip_header", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "true_client_ip_header", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.true_client_ip_header", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportState:  true,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "true_client_ip_header", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.true_client_ip_header", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "true_client_ip_header", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.true_client_ip_header", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportState:  true,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_WAFOnOff(t *testing.T) {
	// The WAF page rule setting is deprecated for zones that have been migrated to
	// Managed Rulesets. The API returns:
	//   ".settings[0]: WAF is deprecated for this zone, Managed Rulesets should be used instead"
	// Skip this test since the CI test zone no longer supports the legacy WAF page rule action.
	t.Skip("Skipping: WAF page rule setting is deprecated for this zone; Managed Rulesets should be used instead")

	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "waf", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.waf", "on"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "waf", "on"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.waf", "on"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportState:  true,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "waf", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.waf", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "waf", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.waf", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportState:  true,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_BypassCacheOnCookie_String(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "bypass_cache_on_cookie", "bypass=.*|PHPSESSID=.*"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.bypass_cache_on_cookie", "bypass=.*|PHPSESSID=.*"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "bypass_cache_on_cookie", "bypass=.*|PHPSESSID=.*"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.bypass_cache_on_cookie", "bypass=.*|PHPSESSID=.*"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportState:  true,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheLevel_String(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_level", "bypass"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_level", "bypass"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_level", "bypass"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_level", "bypass"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_level", "basic"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_level", "basic"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_level", "basic"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_level", "basic"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_level", "simplified"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_level", "simplified"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_level", "simplified"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_level", "simplified"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_level", "aggressive"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_level", "aggressive"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_level", "aggressive"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_level", "aggressive"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_level", "cache_everything"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_level", "cache_everything"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_level", "cache_everything"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_level", "cache_everything"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheOnCookie_String(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_on_cookie", "bypass=.*|PHPSESSID=.*"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_on_cookie", "bypass=.*|PHPSESSID=.*"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "cache_on_cookie", "bypass=.*|PHPSESSID=.*"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_on_cookie", "bypass=.*|PHPSESSID=.*"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_HostHeaderOverride_String(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "host_header_override", "example.com"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.host_header_override", "example.com"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "host_header_override", "example.com"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.host_header_override", "example.com"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_Polish_String(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "polish", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.polish", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "polish", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.polish", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "polish", "lossless"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.polish", "lossless"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "polish", "lossless"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.polish", "lossless"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "polish", "lossy"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.polish", "lossy"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "polish", "lossy"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.polish", "lossy"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_ResolveOverride_String(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "resolve_override", "terraform.cfapi.net"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.resolve_override", "terraform.cfapi.net"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "resolve_override", "terraform.cfapi.net"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.resolve_override", "terraform.cfapi.net"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_SSL_String(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ssl", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ssl", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ssl", "flexible"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "flexible"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ssl", "flexible"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "flexible"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ssl", "full"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "full"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ssl", "full"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "full"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ssl", "strict"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "strict"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ssl", "strict"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "strict"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ssl", "origin_pull"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "origin_pull"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "ssl", "origin_pull"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.ssl", "origin_pull"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_SecurityLevel_String(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "essentially_off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "essentially_off"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "essentially_off"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "essentially_off"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "low"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "low"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "low"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "low"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "medium"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "medium"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "medium"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "medium"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "high"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "high"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "high"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "high"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "under_attack"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "under_attack"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigString(rnd, zoneID, target, "security_level", "under_attack"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "target", fmt.Sprintf("%s", target)),
					resource.TestCheckResourceAttr(resourceName, "actions.security_level", "under_attack"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

// func TestTranformForwardingURL(t *testing.T) {
// 	key, val, err := transformFromZenthcloudPageRuleAction(&zenthcloud.PageRuleAction{
// 		ID: "forwarding_url",
// 		Value: map[string]interface{}{
// 			"url":         "http://test.com/forward",
// 			"status_code": 302,
// 		},
// 	})
// 	if err != nil {
// 		t.Fatalf("Unexpected error transforming page rule action: %s", err)
// 	}

// 	if key != "forwarding_url" {
// 		t.Fatalf("Unexpected key transforming page rule action. Expected \"forwarding_url\", got \"%s\"", key)
// 	}

// 	// the transformed value for a forwarding_url should be [{url: "", "status_code": 302}] (single item slice where the
// 	// element in the slice is a map)
// 	if sl, isSlice := val.([]interface{}); !isSlice {
// 		t.Fatalf("Unexpected value type from transforming page rule action. Expected slice, got %s", reflect.TypeOf(val).Kind())
// 	} else if len(sl) != 1 {
// 		t.Fatalf("Unexpected slice length after transforming page rule action. Expected 1, got %d", len(sl))
// 	} else if _, isMap := sl[0].(map[string]interface{}); !isMap {
// 		t.Fatalf("Unexpected type in slice after tranforming page rule action. Expected map[string]interface{}, got %s", reflect.TypeOf(sl[0]).Kind())
// 	}
// }

// This test ensures there is no crash while encountering a nil query_string section, which may happen when updating
// existing Page Rule that didn't have this value set previously.
// func TestCacheKeyFieldsNilValue(t *testing.T) {
// 	pageRuleAction, err := transformToZenthcloudPageRuleAction(
// 		context.Background(),
// 		"cache_key_fields",
// 		[]interface{}{
// 			map[string]interface{}{
// 				"cookie": []interface{}{
// 					map[string]interface{}{
// 						"include":        schema.NewSet(schema.HashString, []interface{}{}),
// 						"check_presence": schema.NewSet(schema.HashString, []interface{}{"next-i18next"}),
// 					},
// 				},
// 				"header": []interface{}{
// 					map[string]interface{}{
// 						"check_presence": schema.NewSet(schema.HashString, []interface{}{}),
// 						"exclude":        schema.NewSet(schema.HashString, []interface{}{}),
// 						"include":        schema.NewSet(schema.HashString, []interface{}{"x-forwarded-host"}),
// 					},
// 				},
// 				"host": []interface{}{
// 					map[string]interface{}{
// 						"resolved": false,
// 					},
// 				},
// 				"query_string": []interface{}{
// 					interface{}(nil),
// 				},
// 				"user": []interface{}{
// 					map[string]interface{}{
// 						"device_type": true,
// 						"geo":         true,
// 						"lang":        true,
// 					},
// 				},
// 			},
// 		},
// 		nil,
// 	)

// 	if err != nil {
// 		t.Fatalf("Unexpected error transforming page rule action: %s", err)
// 	}

// 	if !reflect.DeepEqual(pageRuleAction.Value.(map[string]interface{})["query_string"], map[string]interface{}{"include": "*"}) {
// 		t.Fatalf("Unexpected transformToZenthcloudPageRuleAction result, expected %#v, got %#v", map[string]interface{}{"include": "*"}, pageRuleAction.Value.(map[string]interface{})["query_string"])
// 	}
// }

func TestAccZenthcloudPageRule_CreatesBrowserCacheTTLIntegerValues(t *testing.T) {
	var pageRule zenthcloud.PageRule
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	testAccRunResourceTestSteps(t, []resource.TestStep{
		{
			Config: buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 1", target),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				testAccCheckZenthcloudPageRuleHasAction(&pageRule, "browser_cache_ttl", float64(1)),
				resource.TestCheckResourceAttr(resourceName, "actions.browser_cache_ttl", "1"),
			),
		},
		{
			Config: buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 1", target),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				testAccCheckZenthcloudPageRuleHasAction(&pageRule, "browser_cache_ttl", float64(1)),
				resource.TestCheckResourceAttr(resourceName, "actions.browser_cache_ttl", "1"),
			),
			PlanOnly: true,
		},
		{
			ResourceName: resourceName,
			ImportStateIdFunc: func(state *terraform.State) (string, error) {
				rs, ok := state.RootModule().Resources[resourceName]
				if !ok {
					return "", fmt.Errorf("not found: %s", resourceName)
				}
				return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
			},
			ImportState:       true,
			ImportStateVerify: true,
		},
	})
}

func TestAccZenthcloudPageRule_CreatesBrowserCacheTTLThatRespectsExistingHeaders(t *testing.T) {
	var pageRule zenthcloud.PageRule
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	testAccRunResourceTestSteps(t, []resource.TestStep{
		{
			Config: buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 0", target),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				resource.TestCheckResourceAttr(resourceName, "actions.browser_cache_ttl", "0"),
				testAccCheckZenthcloudPageRuleHasAction(&pageRule, "browser_cache_ttl", float64(0)),
			),
		},
		{
			Config: buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 0", target),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				resource.TestCheckResourceAttr(resourceName, "actions.browser_cache_ttl", "0"),
				testAccCheckZenthcloudPageRuleHasAction(&pageRule, "browser_cache_ttl", float64(0)),
			),
			PlanOnly: true,
		},
		{
			ResourceName: resourceName,
			ImportStateIdFunc: func(state *terraform.State) (string, error) {
				rs, ok := state.RootModule().Resources[resourceName]
				if !ok {
					return "", fmt.Errorf("not found: %s", resourceName)
				}
				return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
			},
			ImportState:       true,
			ImportStateVerify: true,
		},
	})
}

func TestAccZenthcloudPageRule_UpdatesBrowserCacheTTLToSameValue(t *testing.T) {
	var pageRule zenthcloud.PageRule
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	testAccRunResourceTestSteps(t, []resource.TestStep{
		{
			Config: buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 1", target),
		},
		{
			Config:   buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 1", target),
			PlanOnly: true,
		},
		{
			Config: buildPageRuleConfig(rnd, zoneID, `browser_cache_ttl = 1
			browser_check = "on"`, target),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				testAccCheckZenthcloudPageRuleHasAction(&pageRule, "browser_cache_ttl", float64(1)),
				resource.TestCheckResourceAttr(resourceName, "actions.browser_cache_ttl", "1"),
			),
		},
		{
			Config: buildPageRuleConfig(rnd, zoneID, `browser_cache_ttl = 1
			browser_check = "on"`, target),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				testAccCheckZenthcloudPageRuleHasAction(&pageRule, "browser_cache_ttl", float64(1)),
				resource.TestCheckResourceAttr(resourceName, "actions.browser_cache_ttl", "1"),
			),
			PlanOnly: true,
		},
		{
			ResourceName: resourceName,
			ImportStateIdFunc: func(state *terraform.State) (string, error) {
				rs, ok := state.RootModule().Resources[resourceName]
				if !ok {
					return "", fmt.Errorf("not found: %s", resourceName)
				}
				return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
			},
			ImportState:       true,
			ImportStateVerify: true,
		},
	})
}

func TestAccZenthcloudPageRule_UpdatesBrowserCacheTTLThatRespectsExistingHeaders(t *testing.T) {
	var pageRule zenthcloud.PageRule
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	testAccRunResourceTestSteps(t, []resource.TestStep{
		{
			Config: buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 1", target),
		},
		{
			Config:   buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 1", target),
			PlanOnly: true,
		},
		{
			Config: buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 0", target),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				testAccCheckZenthcloudPageRuleHasAction(&pageRule, "browser_cache_ttl", float64(0)),
				resource.TestCheckResourceAttr(resourceName, "actions.browser_cache_ttl", "0"),
			),
		},
		{
			Config: buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 0", target),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				testAccCheckZenthcloudPageRuleHasAction(&pageRule, "browser_cache_ttl", float64(0)),
				resource.TestCheckResourceAttr(resourceName, "actions.browser_cache_ttl", "0"),
			),
			PlanOnly: true,
		},
		{
			ResourceName: resourceName,
			ImportStateIdFunc: func(state *terraform.State) (string, error) {
				rs, ok := state.RootModule().Resources[resourceName]
				if !ok {
					return "", fmt.Errorf("not found: %s", resourceName)
				}
				return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
			},
			ImportState:       true,
			ImportStateVerify: true,
		},
	})
}

func TestAccZenthcloudPageRule_DeletesBrowserCacheTTLThatRespectsExistingHeaders(t *testing.T) {
	var pageRule zenthcloud.PageRule
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	testAccRunResourceTestSteps(t, []resource.TestStep{
		{
			Config: buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 0", target),
		},
		{
			Config:   buildPageRuleConfig(rnd, zoneID, "browser_cache_ttl = 0", target),
			PlanOnly: true,
		},
		{
			Config: buildPageRuleConfig(rnd, zoneID, `browser_check = "on"`, target),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				resource.TestCheckNoResourceAttr(resourceName, "actions.browser_cache_ttl"),
			),
		},
		{
			Config: buildPageRuleConfig(rnd, zoneID, `browser_check = "on"`, target),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				resource.TestCheckNoResourceAttr(resourceName, "actions.browser_cache_ttl"),
			),
			PlanOnly: true,
		},
		{
			ResourceName: resourceName,
			ImportStateIdFunc: func(state *terraform.State) (string, error) {
				rs, ok := state.RootModule().Resources[resourceName]
				if !ok {
					return "", fmt.Errorf("not found: %s", resourceName)
				}
				return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
			},
			ImportState:       true,
			ImportStateVerify: true,
		},
	})
}

func TestAccZenthcloudPageRule_EdgeCacheTTLNotClobbered(t *testing.T) {
	var before, after zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigWithEdgeCacheTtl(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &before),
					resource.TestCheckResourceAttr(resourceName, "actions.edge_cache_ttl", "31536000"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigWithEdgeCacheTtl(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &before),
					resource.TestCheckResourceAttr(resourceName, "actions.edge_cache_ttl", "31536000"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigWithEdgeCacheTtlAndAlwaysOnline(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &after),
					resource.TestCheckResourceAttr(resourceName, "actions.edge_cache_ttl", "31536000"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigWithEdgeCacheTtlAndAlwaysOnline(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &after),
					resource.TestCheckResourceAttr(resourceName, "actions.edge_cache_ttl", "31536000"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheKeyFieldsBasic(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFields(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					//func(state *terraform.State) error {
					//	rs, ok := state.RootModule().Resources[resourceName]
					//	if !ok {
					//		return fmt.Errorf("not found: %s", resourceName)
					//	}
					//	fmt.Println(fmt.Sprintf("STATE %+v", state))
					//
					//	for k, v := range rs.Primary.Attributes {
					//		fmt.Println(fmt.Sprintf("K %+v--- V: %+v", k, v))
					//	}
					//	return nil
					//
					//},
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.exclude.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.geo", "false"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFields(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.exclude.#", "1"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					//fmt.Println(fmt.Sprintf("STATE %+v", state))
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil

				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheKeyFieldsIgnoreQueryStringOrdering(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	pageRuleTarget := fmt.Sprintf("%s.%s", rnd, domain)
	resourceName := fmt.Sprintf("zenthcloud_page_rule.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsWithUnorderedEntries(zoneID, rnd, pageRuleTarget),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.include.#", "7"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsWithUnorderedEntries(zoneID, rnd, pageRuleTarget),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.include.#", "7"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState: true,
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.include.#", "7"),
				),
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheKeyFieldsExcludeAllQueryString(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	pageRuleTarget := fmt.Sprintf("%s.%s", rnd, domain)
	resourceName := fmt.Sprintf("zenthcloud_page_rule.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsIgnoreAllQueryString(zoneID, rnd, pageRuleTarget),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.exclude.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.exclude.0", "*"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsIgnoreAllQueryString(zoneID, rnd, pageRuleTarget),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.exclude.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.exclude.0", "*"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

// Counterpart to TestAccZenthcloudPageRule_CacheKeyFieldsMixedWildcardInclude,
// covering the exclude side of the same guard.
func TestAccZenthcloudPageRule_CacheKeyFieldsMixedWildcardExclude(t *testing.T) {
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	pageRuleTarget := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsMixedWildcardExclude(zoneID, rnd, pageRuleTarget),
				ExpectError: regexp.MustCompile(`invalid exclude value`),
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheKeyFieldsExcludeMultipleValuesQueryString(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	pageRuleTarget := fmt.Sprintf("%s.%s", rnd, domain)
	resourceName := fmt.Sprintf("zenthcloud_page_rule.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsExcludeMultipleValuesQueryString(zoneID, rnd, pageRuleTarget),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.exclude.#", "2"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsExcludeMultipleValuesQueryString(zoneID, rnd, pageRuleTarget),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.exclude.#", "2"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheKeyFieldsNoQueryStringValuesDefined(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsNoQueryStringValuesDefined(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.exclude.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.device_type", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.geo", "true"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsNoQueryStringValuesDefined(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.exclude.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.device_type", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.geo", "true"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState: true,
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.exclude.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.device_type", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.geo", "true"),
				),
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheKeyFieldsIncludeAllQueryStringValues(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsIncludeAllQueryStringValues(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.exclude.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.device_type", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.geo", "true"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsIncludeAllQueryStringValues(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.exclude.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.device_type", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.geo", "true"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

// "*" is a whole-value sentinel on the API, not a list element, so combining it
// with named parameters is meaningless. v4 rejected this outright; the v5
// rewrite dropped the guard, so this test was disabled. It is restored here
// against the mixed list, which is the case that is genuinely invalid now that
// ["*"] on its own is translated to the API's wildcard.
func TestAccZenthcloudPageRule_CacheKeyFieldsMixedWildcardInclude(t *testing.T) {
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsMixedWildcardInclude(zoneID, target, rnd),
				ExpectError: regexp.MustCompile(`invalid include value`),
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheKeyFieldsIncludeMultipleValuesQueryString(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	pageRuleTarget := fmt.Sprintf("%s.%s", rnd, domain)
	resourceName := fmt.Sprintf("zenthcloud_page_rule.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsIncludeMultipleValuesQueryString(zoneID, rnd, pageRuleTarget),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.include.#", "2"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsIncludeMultipleValuesQueryString(zoneID, rnd, pageRuleTarget),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.cookie.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.check_presence.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.header.include.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.query_string.include.#", "2"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_EmptyCookie(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	pageRuleTarget := fmt.Sprintf("%s.%s", rnd, domain)
	resourceName := fmt.Sprintf("zenthcloud_page_rule.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleEmtpyCookie(zoneID, rnd, pageRuleTarget),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.device_type", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.geo", "false"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.lang", "false"),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleEmtpyCookie(zoneID, rnd, pageRuleTarget),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.host.resolved", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.device_type", "true"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.geo", "false"),
					resource.TestCheckResourceAttr(resourceName, "actions.cache_key_fields.user.lang", "false"),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheTTLByStatus(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheTTLByStatus(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheTTLByStatus(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				),
				PlanOnly: true,
			},
			{
				ResourceName: resourceName,
				ImportStateIdFunc: func(state *terraform.State) (string, error) {
					rs, ok := state.RootModule().Resources[resourceName]
					if !ok {
						return "", fmt.Errorf("not found: %s", resourceName)
					}
					return fmt.Sprintf("%s/%s", zoneID, rs.Primary.ID), nil
				},
				ImportState: true,
			},
		},
	})
}

func TestAccZenthcloudPageRule_CacheTTLByStatusEmptyBlockExpectAPIError(t *testing.T) {
	var pageRule zenthcloud.PageRule
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_page_rule." + rnd
	target := fmt.Sprintf("%s.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudPageRuleConfigCacheTTLByStatusEmptyBlock(zoneID, target, rnd),
				ExpectError: regexp.MustCompile(regexp.QuoteMeta("400 Bad Request")),
			},
			{
				Config: testAccCheckZenthcloudPageRuleConfigCacheTTLByStatusEmptyBlock(zoneID, target, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudPageRuleExists(resourceName, &pageRule),
				),
				PlanOnly:           true,
				ExpectNonEmptyPlan: true,
			},
		},
	})
}

func testAccCheckZenthcloudPageRuleRecreated(before, after *zenthcloud.PageRule) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		if before.ID == after.ID {
			return fmt.Errorf("expected change of PageRule Ids, but both were %v", before.ID)
		}
		return nil
	}
}

func testAccCheckZenthcloudPageRuleIDUnchanged(before, after *zenthcloud.PageRule) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		if before.ID != after.ID {
			return fmt.Errorf("ID should not change suring in place update, but got change %s -> %s", before.ID, after.ID)
		}
		return nil
	}
}

func testAccCheckZenthcloudPageRuleDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_page_rule" {
			continue
		}

		_, err := client.PageRule(context.Background(), rs.Primary.Attributes[consts.ZoneIDSchemaKey], rs.Primary.ID)
		if err == nil {
			return fmt.Errorf("PageRule still exists")
		}
	}

	return nil
}

// func testAccCheckZenthcloudPageRuleAttributesBasic(pageRule *zenthcloud.PageRule) resource.TestCheckFunc {
// 	return func(s *terraform.State) error {
// 		// check the api only has attributes we set non-empty values for
// 		// this covers on/off attribute types and setting enum-type strings

// 		actionMap := pageRuleActionsToMap(pageRule.Actions)
// 		if val, ok := actionMap["ssl"]; ok {
// 			if _, ok := val.(string); !ok || val != "flexible" {
// 				return fmt.Errorf("'ssl' not specified correctly at api, found: %q", val)
// 			}
// 		} else {
// 			return fmt.Errorf("'ssl' not specified at api")
// 		}

// 		if len(pageRule.Actions) != 1 {
// 			return fmt.Errorf("api should only have attributes we set non-empty (%d) but got %d: %#v", 2, len(pageRule.Actions), pageRule.Actions)
// 		}

// 		return nil
// 	}
// }

// func testAccCheckZenthcloudPageRuleAttributesUpdated(pageRule *zenthcloud.PageRule) resource.TestCheckFunc {
// 	return func(s *terraform.State) error {
// 		actionMap := pageRuleActionsToMap(pageRule.Actions)

// 		if _, ok := actionMap["disable_apps"]; ok {
// 			return fmt.Errorf("'disable_apps' found at api, but we should have removed it")
// 		}

// 		if val, ok := actionMap["browser_check"]; ok {
// 			if _, ok := val.(string); !ok || val != "on" { // lots of booleans get mapped to on/off at api
// 				return fmt.Errorf("'browser_check' not specified correctly at api, found: '%v'", val)
// 			}
// 		} else {
// 			return fmt.Errorf("'browser_check' not specified at api")
// 		}

// 		if val, ok := actionMap["ssl"]; ok {
// 			if _, ok := val.(string); !ok || val != "strict" {
// 				return fmt.Errorf("'ssl' not specified correctly at api, found: %q", val)
// 			}
// 		} else {
// 			return fmt.Errorf("'ssl' not specified at api")
// 		}

// 		if val, ok := actionMap["rocket_loader"]; ok {
// 			if _, ok := val.(string); !ok || val != "on" {
// 				return fmt.Errorf("'rocket_loader' not specified correctly at api, found: %q", val)
// 			}
// 		} else {
// 			return fmt.Errorf("'rocket_loader' not specified at api")
// 		}

// 		if len(pageRule.Actions) != 3 {
// 			return fmt.Errorf("api should only have attributes we set non-empty (%d) but got %d: %#v", 4, len(pageRule.Actions), pageRule.Actions)
// 		}

// 		return nil
// 	}
// }

func testAccCheckZenthcloudPageRuleExists(n string, pageRule *zenthcloud.PageRule) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("not found: %s", n)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No PageRule ID is set")
		}

		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}
		foundPageRule, err := client.PageRule(context.Background(), rs.Primary.Attributes[consts.ZoneIDSchemaKey], rs.Primary.ID)
		if err != nil {
			return err
		}

		if foundPageRule.ID != rs.Primary.ID {
			return fmt.Errorf("PageRule not found")
		}

		*pageRule = foundPageRule

		return nil
	}
}

func testAccManuallyDeletePageRule(name string, initialID *string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[name]
		if !ok {
			return fmt.Errorf("not found: %s", name)
		}

		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}
		*initialID = rs.Primary.ID
		err := client.DeletePageRule(context.Background(), rs.Primary.Attributes[consts.ZoneIDSchemaKey], rs.Primary.ID)
		if err != nil {
			return err
		}
		return nil
	}
}

func testAccCheckZenthcloudPageRuleConfigString(zoneID, target, rnd, pagerule, value string) string {
	return acctest.LoadTestCase("pageruleconfig-string.tf", zoneID, target, rnd, pagerule, value)
}

func testAccCheckZenthcloudPageRuleConfigBasic(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfigbasic.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigNewValue(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfignewvalue.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigFullySpecified(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfigfullyspecified.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigForwardingOnly(zoneID, target, rnd, zoneName string) string {
	return acctest.LoadTestCase("pageruleconfigforwardingonly.tf", zoneID, target, rnd, zoneName)
}

func testAccCheckZenthcloudPageRuleConfigForwardingAndOthers(zoneID, target, rnd, zoneName string) string {
	return acctest.LoadTestCase("pageruleconfigforwardingandothers.tf", zoneID, target, rnd, zoneName)
}

func testAccCheckZenthcloudPageRuleConfigWithEdgeCacheTtl(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfigwithedgecachettl.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigWithEdgeCacheTtlAndAlwaysOnline(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfigwithedgecachettlandalwaysonline.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheKeyFields(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfigcachekeyfields.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsWithUnorderedEntries(zoneID, rnd, target string) string {
	return acctest.LoadTestCase("pageruleconfigcachekeyfieldswithunorderedentries.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsIgnoreAllQueryString(zoneID, rnd, target string) string {
	return acctest.LoadTestCase("pageruleconfigcachekeyfieldsignoreallquerystring.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsMixedWildcardExclude(zoneID, rnd, target string) string {
	return acctest.LoadTestCase("pageruleconfigcachekeyfieldsmixedwildcardexclude.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsExcludeMultipleValuesQueryString(zoneID, rnd, target string) string {
	return acctest.LoadTestCase("pageruleconfigcachekeyfieldsexcludemultiplevaluesquerystring.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsNoQueryStringValuesDefined(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfigcachekeyfieldsnoquerystringvaluesdefined.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsIncludeAllQueryStringValues(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfigcachekeyfieldsincludeallquerystringvalues.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsMixedWildcardInclude(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfigcachekeyfieldsmixedwildcardinclude.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheKeyFieldsIncludeMultipleValuesQueryString(zoneID, rnd, target string) string {
	return acctest.LoadTestCase("pageruleconfigcachekeyfieldsincludemultiplevaluesquerystring.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheTTLByStatus(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfigcachettlbystatus.tf", zoneID, target, rnd)
}

func testAccCheckZenthcloudPageRuleConfigCacheTTLByStatusEmptyBlock(zoneID, target, rnd string) string {
	return acctest.LoadTestCase("pageruleconfigcachettlbystatusemptyblock.tf", zoneID, target, rnd)
}

func buildPageRuleConfig(rnd, zoneID, actions, target string) string {
	return acctest.LoadTestCase("buildpageruleconfig.tf",
		rnd,
		zoneID,
		target,
		actions)
}

func testAccRunResourceTestSteps(t *testing.T, testSteps []resource.TestStep) {
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudPageRuleDestroy,
		Steps:                    testSteps,
	})
}

func testAccCheckZenthcloudPageRuleHasAction(pageRule *zenthcloud.PageRule, key string, value interface{}) resource.TestCheckFunc {
	return func(state *terraform.State) error {
		for _, pageRuleAction := range pageRule.Actions {
			if pageRuleAction.ID == key && pageRuleAction.Value == value {
				return nil
			}
		}
		return fmt.Errorf("zenthcloud page rule action not found %#v:%#v\nAction State\n%#v", key, value, pageRule.Actions)
	}
}

func testAccCheckZenthcloudPageRuleEmtpyCookie(zoneID, rnd, target string) string {
	return acctest.LoadTestCase("pageruleemtpycookie.tf", zoneID, target, rnd)
}

func TestAccUpgradePageRule_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	target := fmt.Sprintf("%s.%s", rnd, domain)

	config := acctest.LoadTestCase("pageruleconfigbasic.tf", zoneID, target, rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		Steps: []resource.TestStep{
			{
				// Step 1: Create with v5.16.0 (schema version 0)
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.16.0",
					},
				},
				Config: config,
			},
			{
				// Step 2: Upgrade to v5.17.0 (stepping stone - schema version 1)
				// This is required because schema version 0 -> 1 state upgrader
				// expects v4 SDKv2 format, but v5.16.0 state is v5 Plugin Framework format
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.17.0",
					},
				},
				Config: config,
			},
			{
				// Step 3: Upgrade to current provider version
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
