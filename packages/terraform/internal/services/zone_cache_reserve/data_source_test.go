package zone_cache_reserve_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccDataZenthcloudZoneCacheReserve_Basic(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("data.zenthcloud_zone_cache_reserve.%s", rnd)

	resource.ParallelTest(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			// testAccZenthcloudZoneCacheReserveUpdate(t, zoneID, true)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccDataZenthcloudZoneCacheReserveConfig(zoneID, rnd),
				Check: resource.ComposeTestCheckFunc(
					// testAccCheckZenthcloudZoneCacheReserveValuesUpdated(zoneID, true),
					resource.TestCheckResourceAttrSet(name, consts.ZoneIDSchemaKey),
					resource.TestCheckResourceAttr(name, "value", "off"),
				),
			},
		},
	})
}

func testAccDataZenthcloudZoneCacheReserveConfig(zoneID, name string) string {
	return fmt.Sprintf(`
		data "zenthcloud_zone_cache_reserve" "%[2]s" {
			zone_id = "%[1]s"
		}`, zoneID, name)
}
