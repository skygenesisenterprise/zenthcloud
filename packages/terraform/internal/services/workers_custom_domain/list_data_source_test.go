package workers_custom_domain_test

import (
	"os"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudWorkersCustomDomainsDataSource_List(t *testing.T) {
	t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	hostname := rnd + "." + zoneName
	resourceName := "zenthcloud_workers_custom_domain." + rnd
	dataSourceName := "data.zenthcloud_workers_custom_domains." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudWorkersCustomDomainDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWorkersCustomDomainsListDataSourceConfig(rnd, accountID, hostname, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					// Check the resource was created properly
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("hostname"), knownvalue.StringExact(hostname)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("service"), knownvalue.StringExact("mute-truth-fdb1")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),

					// Check the list data source returns results
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("hostname"), knownvalue.StringExact(hostname)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("service"), knownvalue.StringExact("mute-truth-fdb1")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("environment"), knownvalue.StringExact("production")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("zone_name"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func testAccZenthcloudWorkersCustomDomainsListDataSourceConfig(rnd, accountID, hostname, zoneID string) string {
	return acctest.LoadTestCase("list_datasource.tf", rnd, accountID, hostname, zoneID)
}
