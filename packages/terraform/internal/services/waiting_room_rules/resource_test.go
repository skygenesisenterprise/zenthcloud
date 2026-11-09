package waiting_room_rules_test

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
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_waiting_room_rules", &resource.Sweeper{
		Name: "zenthcloud_waiting_room_rules",
		F:    testSweepZenthcloudWaitingRoomRules,
	})
}

func testSweepZenthcloudWaitingRoomRules(r string) error {
	ctx := context.Background()
	// Waiting Room Rules is a waiting room-level configuration.
	// Rules are tied to waiting rooms, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "Waiting Room Rules doesn't require sweeping (waiting room configuration)")
	return nil
}

func TestAccZenthcloudWaitingRoomRules_Basic(t *testing.T) {
	t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	waitingRoomName := fmt.Sprintf("waiting_room_%s", rnd)
	name := fmt.Sprintf("zenthcloud_waiting_room_rules.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudWaitingRoomRulesDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWaitingRoomRules(rnd, zoneID, domain, waitingRoomName),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttrSet(name, "waiting_room_id"),

					resource.TestCheckResourceAttr(name, "rules.0.description", "ip bypass"),
					resource.TestCheckResourceAttr(name, "rules.0.expression", "ip.src in {192.0.2.1}"),
					resource.TestCheckResourceAttr(name, "rules.0.action", "bypass_waiting_room"),
					resource.TestCheckResourceAttr(name, "rules.0.enabled", "true"),

					resource.TestCheckResourceAttr(name, "rules.1.description", "query string bypass"),
					resource.TestCheckResourceAttr(name, "rules.1.expression", "http.request.uri.query contains \"bypass=true\""),
					resource.TestCheckResourceAttr(name, "rules.1.action", "bypass_waiting_room"),
					resource.TestCheckResourceAttr(name, "rules.1.enabled", "false"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudWaitingRoomRulesDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_waiting_room_rules" {
			continue
		}

		waitingRoomRules, err := client.ListWaitingRoomRules(context.Background(), zenthcloud.ZoneIdentifier(rs.Primary.Attributes[consts.ZoneIDSchemaKey]), zenthcloud.ListWaitingRoomRuleParams{
			WaitingRoomID: rs.Primary.Attributes["waiting_room_id"],
		})
		if err == nil {
			return fmt.Errorf("error reading waiting room rules")
		}
		// when no rules exist, an empty list is returned
		if len(waitingRoomRules) != 0 {
			return fmt.Errorf("waiting room rules still exists")
		}
	}

	return nil
}

func testAccZenthcloudWaitingRoomRules(resourceName, zoneID, domain, waitingRoomName string) string {
	return acctest.LoadTestCase("waitingroomrules.tf", resourceName, zoneID, domain, waitingRoomName)
}

func TestAccUpgradeWaitingRoomRules_FromPublishedV5(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	waitingRoomName := fmt.Sprintf("waiting_room_%s", rnd)

	config := testAccZenthcloudWaitingRoomRules(rnd, zoneID, domain, waitingRoomName)

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
