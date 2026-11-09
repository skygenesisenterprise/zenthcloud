package load_balancer_pool_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestAccZenthcloudLoadBalancerPools(t *testing.T) {
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("data.zenthcloud_load_balancer_pools.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudLoadBalancerPoolsConfig(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttrSet(name, "result.0.name"),
					resource.TestCheckResourceAttrSet(name, "result.1.name"),
				),
			},
		},
	})
}

func testAccZenthcloudLoadBalancerPoolsConfig(name, accountID string) string {
	return acctest.LoadTestCase("loadbalancerpoolsconfig.tf", name, accountID)
}
