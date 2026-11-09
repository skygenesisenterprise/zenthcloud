package zero_trust_tunnel_zenthcloudd_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccZenthcloudTunnelDatasource_List(t *testing.T) {
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("data.zenthcloud_zero_trust_tunnel_zenthcloudds.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudTunnelDatasourceList(accID, rnd),
				Check:  resource.TestCheckResourceAttr(name, "result.0.name", rnd),
			},
		},
	})
}

func testAccCheckZenthcloudTunnelDatasourceList(accID, name string) string {
	return acctest.LoadTestCase("datasource_list.tf", accID, name)
}
