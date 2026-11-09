package workers_route_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudWorkersRouteDataSource_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	resourceName := "zenthcloud_workers_route." + rnd
	dataSourceName := "data.zenthcloud_workers_route." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccWorkersRouteDataSourceConfig(rnd, accountID, zoneID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					// Check the resource was created properly
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("pattern"), knownvalue.StringExact(fmt.Sprintf("%s.%s/*", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("script"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
					
					// Check the data source fetches the route correctly
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("pattern"), knownvalue.StringExact(fmt.Sprintf("%s.%s/*", rnd, domain))),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("script"), knownvalue.StringExact(rnd)),
					// The route_id should match the resource's id
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("route_id"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func testAccWorkersRouteDataSourceConfig(rnd, accountID, zoneID, domain string) string {
	return acctest.LoadTestCase("datasource_basic.tf", rnd, accountID, zoneID, domain)
}
