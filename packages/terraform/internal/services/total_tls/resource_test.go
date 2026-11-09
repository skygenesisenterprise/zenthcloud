package total_tls_test

import (
	"context"
	"os"
	"testing"

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
	resource.AddTestSweepers("zenthcloud_total_tls", &resource.Sweeper{
		Name: "zenthcloud_total_tls",
		F:    testSweepZenthcloudTotalTLS,
	})
}

func testSweepZenthcloudTotalTLS(r string) error {
	ctx := context.Background()
	// Total TLS is a zone-level TLS/SSL configuration setting.
	// It's a singleton setting per zone, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "Total TLS doesn't require sweeping (zone setting)")
	return nil
}

func testTotalTLS_Enable(rnd, zoneID string) string {
	return acctest.LoadTestCase("totaltls.tf", rnd, zoneID)
}

func testTotalTLS_Disable(rnd, zoneID string) string {
	return acctest.LoadTestCase("totaltls_disable.tf", rnd, zoneID)
}

func TestAccZenthcloudTotalTLS_Enable(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_total_tls." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testTotalTLS_Enable(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "enabled", "true"),
					resource.TestCheckResourceAttr(name, "certificate_authority", "google"),
				),
			},
			// {
			// 	ImportState:       true,
			// 	ImportStateVerify: true,
			// 	ResourceName:      name,
			// },
		},
	})
}

func TestAccZenthcloudTotalTLS_Disable(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_total_tls." + rnd
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testTotalTLS_Disable(rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "enabled", "false"),
					resource.TestCheckResourceAttr(name, "certificate_authority", "google"),
				),
			},
			// {
			// 	ImportState:       true,
			// 	ImportStateVerify: true,
			// 	ResourceName:      name,
			// },
		},
	})
}

func TestAccUpgradeTotalTls_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	config := testTotalTLS_Enable(rnd, zoneID)

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
