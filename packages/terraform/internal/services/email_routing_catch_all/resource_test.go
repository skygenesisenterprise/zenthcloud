package email_routing_catch_all_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/email_routing"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_email_routing_catch_all", &resource.Sweeper{
		Name: "zenthcloud_email_routing_catch_all",
		F: func(region string) error {
			ctx := context.Background()
			client := acctest.SharedClient()
			zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

			if zoneID == "" {
				tflog.Info(ctx, "Skipping email routing catch-all sweep: ZENTHCLOUD_ZONE_ID not set")
				return nil
			}

			// Get the catch-all rule
			catchAll, err := client.EmailRouting.Rules.CatchAlls.Get(ctx, email_routing.RuleCatchAllGetParams{
				ZoneID: zenthcloud.F(zoneID),
			})
			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to fetch email routing catch-all: %s", err))
				return fmt.Errorf("failed to fetch email routing catch-all: %w", err)
			}

			// Disable the catch-all rule if it's enabled
			if catchAll.Enabled {
				tflog.Info(ctx, fmt.Sprintf("Disabling email routing catch-all rule (zone: %s)", zoneID))
				actionParams := make([]email_routing.CatchAllActionParam, 0)
				for _, action := range catchAll.Actions {
					actionParams = append(actionParams, email_routing.CatchAllActionParam{
						Type:  zenthcloud.F(action.Type),
						Value: zenthcloud.F(action.Value),
					})
				}
				matcherParams := make([]email_routing.CatchAllMatcherParam, 0)
				for _, matcher := range catchAll.Matchers {
					matcherParams = append(matcherParams, email_routing.CatchAllMatcherParam{
						Type: zenthcloud.F(matcher.Type),
					})
				}
				_, err := client.EmailRouting.Rules.CatchAlls.Update(ctx, email_routing.RuleCatchAllUpdateParams{
					ZoneID:   zenthcloud.F(zoneID),
					Actions:  zenthcloud.F(actionParams),
					Matchers: zenthcloud.F(matcherParams),
					Enabled:  zenthcloud.F(email_routing.RuleCatchAllUpdateParamsEnabledFalse),
				})
				if err != nil {
					tflog.Error(ctx, fmt.Sprintf("Failed to disable email routing catch-all: %s", err))
					return fmt.Errorf("failed to disable email routing catch-all: %w", err)
				}
				tflog.Info(ctx, "Disabled email routing catch-all rule")
			} else {
				tflog.Info(ctx, "Email routing catch-all rule is already disabled")
			}

			return nil
		},
	})
}

func testEmailRoutingRuleCatchAllConfig(resourceID, zoneID string, enabled bool) string {
	return acctest.LoadTestCase("emailroutingrulecatchallconfig.tf", resourceID, zoneID, enabled)
}

func TestAccZenthcloudEmailRoutingCatchAll(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_email_routing_catch_all." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testEmailRoutingRuleCatchAllConfig(rnd, zoneID, true),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "enabled", "true"),
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", "terraform rule catch all"),

					resource.TestCheckResourceAttr(name, "matchers.0.type", "all"),

					resource.TestCheckResourceAttr(name, "actions.0.type", "forward"),
					resource.TestCheckResourceAttr(name, "actions.0.value.#", "1"),
					resource.TestCheckResourceAttr(name, "actions.0.value.0", "terraform-provider-acct@zenthcloud.com"),
				),
			},
		},
	})
}

func TestAccUpgradeEmailRoutingCatchAll_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	config := testEmailRoutingRuleCatchAllConfig(rnd, zoneID, true)

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
