package zone_cache_reserve_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zone_cache_reserve", &resource.Sweeper{
		Name: "zenthcloud_zone_cache_reserve",
		F:    testSweepZenthcloudZoneCacheReserve,
	})
}

func testSweepZenthcloudZoneCacheReserve(r string) error {
	ctx := context.Background()
	// Zone Cache Reserve is a zone-level caching configuration setting.
	// It's a singleton setting per zone, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "Zone Cache Reserve doesn't require sweeping (zone setting)")
	return nil
}

func TestAccZenthcloudZoneCacheReserve_Basic(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zone_cache_reserve.%s", rnd)

	resource.ParallelTest(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZoneCacheReserveConfig(zoneID, rnd, "on"),
				Check: resource.ComposeTestCheckFunc(
					// testAccCheckZenthcloudZoneCacheReserveValuesUpdated(zoneID, true),
					resource.TestCheckResourceAttrSet(name, consts.ZoneIDSchemaKey),
					resource.TestCheckResourceAttr(name, "value", "on"),
				),
			},
			{
				Config: testAccZenthcloudZoneCacheReserveConfig(zoneID, rnd, "off"),
				Check: resource.ComposeTestCheckFunc(
					// testAccCheckZenthcloudZoneCacheReserveValuesUpdated(zoneID, false),
					resource.TestCheckResourceAttrSet(name, consts.ZoneIDSchemaKey),
					resource.TestCheckResourceAttr(name, "value", "off"),
				),
			},
		},
		// CheckDestroy: testAccCheckZenthcloudZoneCacheReserveDestroy(zoneID),
	})
}

// func testAccCheckZenthcloudZoneCacheReserveValuesUpdated(zoneID string, enable bool) resource.TestCheckFunc {
// 	return func(s *terraform.State) error {
// 		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
// 		if clientErr != nil {
// 			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
// 		}

// 		params := zenthcloud.GetCacheReserveParams{}
// 		output, err := client.GetCacheReserve(context.Background(), zenthcloud.ZoneIdentifier(zoneID), params)
// 		if err != nil {
// 			return fmt.Errorf("unable to read Cache Reserve for zone %q: %w", zoneID, err)
// 		}

// 		// Default state for the Cache Reserve for any zone.
// 		var status, value = "disabled", cacheReserveDisabled

// 		if enable {
// 			status, value = "enabled", cacheReserveEnabled
// 		}
// 		if output.Value != value {
// 			return fmt.Errorf("expected Cache Reserve to be %q for zone: %s", status, zoneID)
// 		}

// 		return nil
// 	}
// }

// func testAccCheckZenthcloudZoneCacheReserveDestroy(zoneID string) resource.TestCheckFunc {
// 	return func(s *terraform.State) error {
// 		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
// 		if clientErr != nil {
// 			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
// 		}

// 		params := zenthcloud.GetCacheReserveParams{}
// 		output, err := client.GetCacheReserve(context.Background(), zenthcloud.ZoneIdentifier(zoneID), params)
// 		if err != nil {
// 			return fmt.Errorf("unable to read Cache Reserve for zone %q: %w", zoneID, err)
// 		}

// 		// Ensure that the Cache Reserve support has been correctly
// 		// disabled for a given zone, which is also the default.
// 		if output.Value == cacheReserveEnabled {
// 			return fmt.Errorf("unable to disable Cache Reserve for zone: %s", zoneID)
// 		}

// 		return nil
// 	}
// }

// func testAccZenthcloudZoneCacheReserveUpdate(t *testing.T, zoneID string, enable bool) {
// 	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
// 	if clientErr != nil {
// 		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
// 	}

// 	params := zenthcloud.UpdateCacheReserveParams{
// 		Value: cacheReserveDisabled,
// 	}
// 	if enable {
// 		params.Value = cacheReserveEnabled
// 	}

// 	_, err := client.UpdateCacheReserve(context.Background(), zenthcloud.ZoneIdentifier(zoneID), params)
// 	if err != nil {
// 		t.Errorf("unable to set Cache Reserve for zone %q: %s", zoneID, err)
// 	}
// }

func testAccZenthcloudZoneCacheReserveConfig(zoneID, name, enable string) string {
	return acctest.LoadTestCase("zonecachereserveconfig.tf", zoneID, name, enable)
}
