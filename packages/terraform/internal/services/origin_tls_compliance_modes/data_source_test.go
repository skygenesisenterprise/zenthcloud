package origin_tls_compliance_modes_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccDataZenthcloudOriginTLSComplianceModes_Basic(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("data.zenthcloud_origin_tls_compliance_modes.%s", rnd)

	resource.ParallelTest(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccDataZenthcloudOriginTLSComplianceModesConfig(zoneID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttrSet(name, consts.ZoneIDSchemaKey),
					resource.TestCheckResourceAttrSet(name, "value.#"),
				),
			},
		},
	})
}

func testAccDataZenthcloudOriginTLSComplianceModesConfig(zoneID, name string) string {
	return acctest.LoadTestCase("datasource_basic.tf", zoneID, name)
}
