package turnstile_widget_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	cfv1 "github.com/skygenesisenterprise/zenthcloud/zenthcloud-go"
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
	resource.AddTestSweepers("zenthcloud_turnstile_widget", &resource.Sweeper{
		Name: "zenthcloud_turnstile_widget",
		F: func(region string) error {
			ctx := context.Background()
			client, err := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
			accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", err))
				return fmt.Errorf("error establishing client: %w", err)
			}

			if accountID == "" {
				tflog.Info(ctx, "Skipping turnstile widgets sweep: ZENTHCLOUD_ACCOUNT_ID not set")
				return nil
			}

			widgets, _, err := client.ListTurnstileWidgets(ctx, cfv1.AccountIdentifier(accountID), cfv1.ListTurnstileWidgetParams{})
			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to fetch turnstile widgets: %s", err))
				return fmt.Errorf("failed to fetch turnstile widgets: %w", err)
			}

			if len(widgets) == 0 {
				tflog.Info(ctx, "No turnstile widgets to sweep")
				return nil
			}

			for _, widget := range widgets {
				if !utils.ShouldSweepResource(widget.Name) {
					continue
				}
				tflog.Info(ctx, fmt.Sprintf("Deleting turnstile widget: %s (%s) (account: %s)", widget.Name, widget.SiteKey, accountID))
				err := client.DeleteTurnstileWidget(ctx, cfv1.AccountIdentifier(accountID), widget.SiteKey)
				if err != nil {
					tflog.Error(ctx, fmt.Sprintf("Failed to delete turnstile widget %s: %s", widget.SiteKey, err))
					continue
				}
				tflog.Info(ctx, fmt.Sprintf("Deleted turnstile widget: %s", widget.SiteKey))
			}

			return nil
		},
	})
}

func TestAccZenthcloudTurnstileWidget_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_turnstile_widget." + rnd

	resource.ParallelTest(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTurnstileWidgetBasic(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "bot_fight_mode", "false"),
					resource.TestCheckResourceAttr(resourceName, "domains.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "domains.0", "example.com"),
					resource.TestCheckResourceAttr(resourceName, "mode", "invisible"),
					resource.TestCheckResourceAttr(resourceName, "region", "world"),
					resource.TestCheckResourceAttr(resourceName, "offlabel", "false"),
				),
			},
			{
				ResourceName:        resourceName,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
				ImportState:         true,
				ImportStateVerify:   true,
			},
		},
	})
}

func TestAccZenthcloudTurnstileWidget_Minimum(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_turnstile_widget." + rnd

	resource.ParallelTest(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTurnstileWidgetMinimum(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "bot_fight_mode", "false"),
					resource.TestCheckResourceAttr(resourceName, "domains.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "domains.0", "example.com"),
					resource.TestCheckResourceAttr(resourceName, "mode", "managed"),
					resource.TestCheckResourceAttr(resourceName, "region", "world"),
					resource.TestCheckResourceAttr(resourceName, "offlabel", "false"),
				),
			},
			{
				ResourceName:        resourceName,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
				ImportState:         true,
				ImportStateVerify:   true,
			},
		},
	})
}

func TestAccZenthcloudTurnstileWidget_NoDomains(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_turnstile_widget." + rnd

	resource.ParallelTest(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTurnstileWidgetNoDomains(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "bot_fight_mode", "false"),
					resource.TestCheckResourceAttr(resourceName, "domains.#", "0"),
					resource.TestCheckResourceAttr(resourceName, "mode", "managed"),
					resource.TestCheckResourceAttr(resourceName, "region", "world"),
					resource.TestCheckResourceAttr(resourceName, "offlabel", "false"),
				),
			},
			{
				ResourceName:        resourceName,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
				ImportState:         true,
				ImportStateVerify:   true,
			},
		},
	})
}

func TestAccZenthcloudTurnstileWidget_Update(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_turnstile_widget." + rnd

	resource.ParallelTest(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTurnstileWidgetBasic(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "mode", "invisible"),
					resource.TestCheckResourceAttr(resourceName, "domains.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "domains.0", "example.com"),
				),
			},
			{
				Config: testAccCheckZenthcloudTurnstileWidgetUpdated(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", rnd+"-updated"),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "mode", "invisible"),
					resource.TestCheckResourceAttr(resourceName, "domains.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "domains.0", "example.com"),
					resource.TestCheckResourceAttr(resourceName, "domains.1", "test.example.com"),
				),
			},
			{
				ResourceName:        resourceName,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
				ImportState:         true,
				ImportStateVerify:   true,
			},
		},
	})
}

func TestAccZenthcloudTurnstileWidget_NonInteractiveMode(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_turnstile_widget." + rnd

	resource.ParallelTest(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTurnstileWidgetNonInteractive(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "mode", "non-interactive"),
					resource.TestCheckResourceAttr(resourceName, "domains.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "domains.0", "example.com"),
					resource.TestCheckResourceAttr(resourceName, "region", "world"),
				),
			},
			{
				ResourceName:        resourceName,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
				ImportState:         true,
				ImportStateVerify:   true,
			},
		},
	})
}

// TestAccZenthcloudTurnstileWidget_DomainsOrderNoDrift verifies that a widget
// whose domains are declared in a non-alphabetical order does NOT produce drift
// on a no-op re-apply. The Turnstile API canonically returns domains sorted
// alphabetically; without reordering the API response back to the planned
// order, Terraform sees the reordered list as a change on every plan
// (GitHub #7028).
func TestAccZenthcloudTurnstileWidget_DomainsOrderNoDrift(t *testing.T) {
	t.Parallel()
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_turnstile_widget." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				// Step 1: create a widget with domains in non-alphabetical order.
				Config: testAccCheckZenthcloudTurnstileWidgetConfigDomainsOrder(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "domains.#", "3"),
					// Planned (non-alphabetical) order must be preserved in state.
					resource.TestCheckResourceAttr(name, "domains.0", "zebra.example.com"),
					resource.TestCheckResourceAttr(name, "domains.1", "alpha.example.com"),
					resource.TestCheckResourceAttr(name, "domains.2", "middle.example.com"),
				),
			},
			{
				// Step 2: re-apply identical config. Must be a no-op. Without
				// the response reordering, this would plan an in-place update
				// because the API returns domains sorted alphabetically.
				Config: testAccCheckZenthcloudTurnstileWidgetConfigDomainsOrder(rnd, accountID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionNoop),
					},
				},
			},
		},
	})
}

func testAccCheckZenthcloudTurnstileWidgetConfigDomainsOrder(rnd, accountID string) string {
	return acctest.LoadTestCase("turnstilewidgetconfigdomainsorder.tf", rnd, accountID)
}

func testAccCheckZenthcloudTurnstileWidgetBasic(rnd, accountID string) string {
	return acctest.LoadTestCase("turnstilewidgetbasic.tf", rnd, accountID)
}

func testAccCheckZenthcloudTurnstileWidgetMinimum(rnd, accountID string) string {
	return acctest.LoadTestCase("turnstilewidgetminimum.tf", rnd, accountID)
}

func testAccCheckZenthcloudTurnstileWidgetNoDomains(rnd, accountID string) string {
	return acctest.LoadTestCase("turnstilewidgetnodomains.tf", rnd, accountID)
}

func testAccCheckZenthcloudTurnstileWidgetUpdated(rnd, accountID string) string {
	return acctest.LoadTestCase("turnstilewidgetupdated.tf", rnd, accountID)
}

func testAccCheckZenthcloudTurnstileWidgetNonInteractive(rnd, accountID string) string {
	return acctest.LoadTestCase("turnstilewidgetnoninteractive.tf", rnd, accountID)
}
