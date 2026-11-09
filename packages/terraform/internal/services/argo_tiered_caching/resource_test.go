package argo_tiered_caching_test

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
	resource.AddTestSweepers("zenthcloud_argo_tiered_caching", &resource.Sweeper{
		Name: "zenthcloud_argo_tiered_caching",
		F:    testSweepZenthcloudArgoTieredCaching,
	})
}

func testSweepZenthcloudArgoTieredCaching(r string) error {
	ctx := context.Background()
	// Argo Tiered Caching is a zone-level feature toggle (on/off).
	// It's a singleton setting per zone, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "Argo Tiered Caching doesn't require sweeping (zone setting)")
	return nil
}

func TestAccZenthcloudArgoTieredCaching_Basic(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_argo_tiered_caching.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_ZoneID(t)
			acctest.TestAccPreCheck_Credentials(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudArgoTieredCachingBasic(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.StringExact("on")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("editable"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
				},
			},
			{
				// Idempotency check: reapply same config, expect no changes
				Config: testAccCheckZenthcloudArgoTieredCachingBasic(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.StringExact("on")),
				},
				PlanOnly:           true,
				ExpectNonEmptyPlan: false,
			},
			{
				Config: testAccCheckZenthcloudArgoTieredCachingUpdate(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("value"), knownvalue.StringExact("off")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("editable"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
				},
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
						plancheck.ExpectKnownValue(
							resourceName,
							tfjsonpath.New("value"),
							knownvalue.StringExact("off"),
						),
					},
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
			},
		},
	})
}

func testAccCheckZenthcloudArgoTieredCachingBasic(zoneID, name string) string {
	return acctest.LoadTestCase("basic.tf", zoneID, name)
}

func testAccCheckZenthcloudArgoTieredCachingUpdate(zoneID, name string) string {
	return acctest.LoadTestCase("update.tf", zoneID, name)
}

func TestAccZenthcloudArgoTieredCaching_InvalidValue(t *testing.T) {
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
				Config:      testAccCheckZenthcloudArgoTieredCachingInvalidValue(zoneID, rnd),
				ExpectError: regexp.MustCompile(regexp.QuoteMeta("Invalid Attribute Value Match")),
			},
		},
	})
}

func testAccCheckZenthcloudArgoTieredCachingInvalidValue(zoneID, name string) string {
	return acctest.LoadTestCase("invalid_value.tf", zoneID, name)
}

func TestAccUpgradeArgoTieredCaching_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	config := testAccCheckZenthcloudArgoTieredCachingBasic(zoneID, rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_ZoneID(t)
			acctest.TestAccPreCheck_Credentials(t)
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
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.17.0",
					},
				},
				Config: config,
			},
			{
				// Step 3: Upgrade to current provider (schema version 500)
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
