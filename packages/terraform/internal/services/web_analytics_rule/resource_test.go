package web_analytics_rule_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	zenthcloud "github.com/zenthcloud/zenthcloud-go"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_web_analytics_rule", &resource.Sweeper{
		Name: "zenthcloud_web_analytics_rule",
		F:    testSweepZenthcloudWebAnalyticsRules,
	})
}

func testSweepZenthcloudWebAnalyticsRules(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client()
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping web analytics rules sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	// List all web analytics sites to find rulesets
	sites, _, err := client.ListWebAnalyticsSites(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.ListWebAnalyticsSitesParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch web analytics sites: %s", err))
		return fmt.Errorf("failed to fetch web analytics sites: %w", err)
	}

	if len(sites) == 0 {
		tflog.Info(ctx, "No web analytics sites to check for rules")
		return nil
	}

	for _, site := range sites {
		// List rules for each ruleset
		rulesResp, err := client.ListWebAnalyticsRules(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.ListWebAnalyticsRulesParams{
			RulesetID: site.Ruleset.ID,
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to fetch web analytics rules for ruleset %s: %s", site.Ruleset.ID, err))
			continue
		}

		if len(rulesResp.Rules) == 0 {
			continue
		}

		for _, rule := range rulesResp.Rules {
			// Use standard filtering helper on the host field
			if !utils.ShouldSweepResource(rule.Host) {
				continue
			}

			tflog.Info(ctx, fmt.Sprintf("Deleting web analytics rule: %s (host: %s, account: %s)", rule.ID, rule.Host, accountID))
			_, err := client.DeleteWebAnalyticsRule(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.DeleteWebAnalyticsRuleParams{
				RulesetID: site.Ruleset.ID,
				RuleID:    rule.ID,
			})
			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to delete web analytics rule %s: %s", rule.ID, err))
				continue
			}
			tflog.Info(ctx, fmt.Sprintf("Deleted web analytics rule: %s", rule.ID))
		}
	}

	return nil
}

func TestAccZenthcloudWebAnalyticsRule_Create(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	ruleName := fmt.Sprintf("zenthcloud_web_analytics_rule.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudWebAnalyticsRuleDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWebAnalyticsRule(rnd, accountID, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(ruleName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttrSet(ruleName, "ruleset_id"),
					resource.TestCheckResourceAttr(ruleName, "host", zoneID),
				),
			},
		},
	})
}

func testAccCheckZenthcloudWebAnalyticsRuleDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_web_analytics_rule" {
			continue
		}

		rules, err := client.ListWebAnalyticsRules(context.Background(), zenthcloud.AccountIdentifier(rs.Primary.Attributes[consts.AccountIDSchemaKey]), zenthcloud.ListWebAnalyticsRulesParams{
			RulesetID: rs.Primary.Attributes["ruleset_id"],
		})

		if err == nil {
			for _, rule := range rules.Rules {
				if rule.ID == rs.Primary.Attributes["id"] {
					return fmt.Errorf("web analytics rule still exists")
				}
			}
		}
	}

	return nil
}

func testAccZenthcloudWebAnalyticsRule(resourceName, accountID, zoneId string) string {
	return acctest.LoadTestCase("webanalyticsrule.tf", resourceName, accountID, zoneId)
}
