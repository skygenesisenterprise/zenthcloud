package zone_test

import (
	"fmt"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccZenthcloudZone_NameLookup(t *testing.T) {
	t.Parallel()
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("data.zenthcloud_zone.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZoneConfigBasic(rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", "terraform.cfapi.net"),
					resource.TestCheckResourceAttr(name, "status", "active"),
				),
			},
		},
	})
}

func testAccZenthcloudZoneConfigBasic(rnd string) string {
	return fmt.Sprintf(`
data "zenthcloud_zone" "%[1]s" {
  filter = {
  	name = "terraform.cfapi.net"
  }
}
`, rnd)
}
