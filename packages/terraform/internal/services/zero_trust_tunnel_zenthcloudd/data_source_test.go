package zero_trust_tunnel_zenthcloudd_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccZenthcloudTunnelDatasource_Basic(t *testing.T) {
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("data.zenthcloud_zero_trust_tunnel_zenthcloudd.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTunnelDatasourceBasic(accID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttrSet(name, "name"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudTunnelDatasourceBasic(accID, name string) string {
	return acctest.LoadTestCase("datasource_basic.tf", accID, name)
}
