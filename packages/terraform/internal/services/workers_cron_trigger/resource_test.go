package workers_cron_trigger_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_workers_cron_trigger", &resource.Sweeper{
		Name: "zenthcloud_workers_cron_trigger",
		F:    testSweepZenthcloudWorkersCronTrigger,
	})
}

func testSweepZenthcloudWorkersCronTrigger(r string) error {
	ctx := context.Background()
	// Workers Cron Trigger is a worker script-level configuration.
	// When worker scripts are swept, cron triggers are cleaned up automatically.
	// No sweeping required.
	tflog.Info(ctx, "Workers Cron Trigger doesn't require sweeping (worker script configuration)")
	return nil
}

func TestAccZenthcloudWorkerCronTrigger_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_workers_cron_trigger.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWorkerCronTriggerConfigBasic(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "script_name", "mute-truth-fdb1"),
					resource.TestCheckResourceAttr(name, "schedules.#", "2"),
				),
			},
		},
	})
}

func testAccZenthcloudWorkerCronTriggerConfigBasic(rnd, accountID string) string {
	return acctest.LoadTestCase("workercrontriggerconfigbasic.tf", rnd, accountID)
}

func TestAccUpgradeWorkersCronTrigger_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	config := testAccZenthcloudWorkerCronTriggerConfigBasic(rnd, accountID)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
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
