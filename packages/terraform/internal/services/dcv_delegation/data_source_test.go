package dcv_delegation_test

import (
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccZenthcloudDCVDelegationDataSource_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("data.zenthcloud_dcv_delegation.%s", rnd)
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: acctest.LoadTestCase("datasource_basic.tf", rnd, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "zone_id", zoneID),
					resource.TestCheckResourceAttrSet(name, "uuid"),
					resource.TestCheckResourceAttrWith(name, "uuid", func(value string) error {
						matched, _ := regexp.MatchString("^[a-f0-9]{16}$", value)
						if !matched {
							return fmt.Errorf("expected 16-character hex UUID, got: %s", value)
						}
						return nil
					}),
				),
			},
		},
	})
}
