package snippet_rules_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/snippets"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_snippet_rules", &resource.Sweeper{
		Name: "zenthcloud_snippet_rules",
		F:    testSweepZenthcloudSnippetRules,
	})
}

func testSweepZenthcloudSnippetRules(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	if zoneID == "" {
		tflog.Info(ctx, "Skipping snippet rules sweep: ZENTHCLOUD_ZONE_ID not set")
		return nil
	}

	tflog.Info(ctx, fmt.Sprintf("Deleting all snippet rules (zone: %s)", zoneID))
	_, err := client.Snippets.Rules.Update(ctx, snippets.RuleUpdateParams{
		ZoneID: zenthcloud.F(zoneID),
		Rules:  zenthcloud.F([]snippets.RuleUpdateParamsRule{}),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to delete snippet rules: %s", err))
		return fmt.Errorf("failed to delete snippet rules: %w", err)
	}

	tflog.Info(ctx, "Deleted all snippet rules")
	return nil
}

func TestAccZenthcloudSnippetRules_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	resourceName := "zenthcloud_snippet_rules." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudSnippetRulesDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudSnippetRulesConfig(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("rules").AtSliceIndex(0).AtMapKey("snippet_name"), knownvalue.StringExact("rules_set_snippet")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("rules").AtSliceIndex(0).AtMapKey("expression"), knownvalue.StringExact("http.request.uri.path contains \"/test\"")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("rules").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("rules").AtSliceIndex(0).AtMapKey("description"), knownvalue.StringExact("Test snippet rule")),
				},
			},
			{
				Config: testAccZenthcloudSnippetRulesConfigUpdate(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("rules").AtSliceIndex(0).AtMapKey("snippet_name"), knownvalue.StringExact("rules_set_snippet")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("rules").AtSliceIndex(0).AtMapKey("expression"), knownvalue.StringExact("http.request.uri.path contains \"/updated\"")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("rules").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("rules").AtSliceIndex(0).AtMapKey("description"), knownvalue.StringExact("Updated test snippet rule")),
				},
			},
			// NOTE: we don't test importing b/c resource import is not implemented
		},
	})
}

func testAccCheckZenthcloudSnippetRulesDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_snippet_rules" {
			continue
		}

		zoneID := rs.Primary.Attributes[consts.ZoneIDSchemaKey]

		rules, err := client.Snippets.Rules.List(context.Background(), snippets.RuleListParams{
			ZoneID: zenthcloud.F(zoneID),
		})
		if err != nil {
			return fmt.Errorf("error getting snippet rules: %w", err)
		}

		// Check if any rules still exist
		if rules != nil {
			if len(rules.Result) > 0 {
				return fmt.Errorf("snippet rules still exist")
			}
		}
	}

	return nil
}

func testAccZenthcloudSnippetRulesConfig(rnd, zoneID string) string {
	return acctest.LoadTestCase("basic.tf", rnd, zoneID)
}

func testAccZenthcloudSnippetRulesConfigUpdate(rnd, zoneID string) string {
	return acctest.LoadTestCase("basic_update.tf", rnd, zoneID)
}

func TestAccUpgradeSnippetRules_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	config := testAccZenthcloudSnippetRulesConfig(rnd, zoneID)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
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
