package argo_smart_routing_test

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_argo_smart_routing", &resource.Sweeper{
		Name: "zenthcloud_argo_smart_routing",
		F:    testSweepZenthcloudArgoSmartRouting,
	})
}

func testSweepZenthcloudArgoSmartRouting(r string) error {
	ctx := context.Background()
	// Argo Smart Routing is a zone-level feature toggle (on/off).
	// It's a singleton setting per zone, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "Argo Smart Routing doesn't require sweeping (zone setting)")
	return nil
}

func TestAccZenthcloudArgoSmartRouting_Basic(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_argo_smart_routing.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_ZoneID(t)
			acctest.TestAccPreCheck_Credentials(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudArgoSmartRoutingEnable(zoneID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "id", zoneID),
					resource.TestCheckResourceAttr(name, "zone_id", zoneID),
					resource.TestCheckResourceAttr(name, "value", "on"),
				),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("editable"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
				},
			},
			{
				Config: testAccCheckZenthcloudArgoSmartRoutingEnable(zoneID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "id", zoneID),
					resource.TestCheckResourceAttr(name, "zone_id", zoneID),
					resource.TestCheckResourceAttr(name, "value", "on"),
				),
				PlanOnly:           true,
				ExpectNonEmptyPlan: false,
			},
			{
				Config: testAccCheckZenthcloudArgoSmartRoutingDisable(zoneID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "id", zoneID),
					resource.TestCheckResourceAttr(name, "zone_id", zoneID),
					resource.TestCheckResourceAttr(name, "value", "off"),
				),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
						plancheck.ExpectKnownValue(
							name,
							tfjsonpath.New("value"),
							knownvalue.StringExact("off"),
						),
					},
				},
			},
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func TestAccZenthcloudArgoSmartRouting_InvalidValue(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_ZoneID(t)
			acctest.TestAccPreCheck_Credentials(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudArgoSmartRoutingInvalidValue(zoneID, rnd),
				ExpectError: regexp.MustCompile(regexp.QuoteMeta("Invalid Attribute Value Match")),
			},
		},
	})
}

func testAccCheckZenthcloudArgoSmartRoutingEnable(zoneID, name string) string {
	return acctest.LoadTestCase("enable.tf", zoneID, name)
}

func testAccCheckZenthcloudArgoSmartRoutingDisable(zoneID, name string) string {
	return acctest.LoadTestCase("disable.tf", zoneID, name)
}

func testAccCheckZenthcloudArgoSmartRoutingInvalidValue(zoneID, name string) string {
	return acctest.LoadTestCase("invalid_value.tf", zoneID, name)
}

func TestAccZenthcloudArgoSmartRoutingDataSource_Basic(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_argo_smart_routing.%s", rnd)
	dataSourceName := fmt.Sprintf("data.zenthcloud_argo_smart_routing.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_ZoneID(t)
			acctest.TestAccPreCheck_Credentials(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudArgoSmartRoutingDataSourceBasic(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					// Check the resource attributes
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.StringExact("on")),

					// Check the data source attributes
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("value"), knownvalue.StringExact("on")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("editable"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func testAccCheckZenthcloudArgoSmartRoutingDataSourceBasic(zoneID, name string) string {
	return acctest.LoadTestCase("datasource_basic.tf", zoneID, name)
}

func TestAccUpgradeArgoSmartRouting_FromPublishedV5(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()

	config := testAccCheckZenthcloudArgoSmartRoutingEnable(zoneID, rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_ZoneID(t)
			acctest.TestAccPreCheck_Credentials(t)
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
