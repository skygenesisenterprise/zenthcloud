package workers_custom_domain_test

import (
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudWorkersCustomDomainDataSource_ByID(t *testing.T) {
	t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	hostname := rnd + "." + zoneName
	resourceName := "zenthcloud_workers_custom_domain." + rnd
	dataSourceName := "data.zenthcloud_workers_custom_domain." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudWorkersCustomDomainDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWorkersCustomDomainDataSourceByIDConfig(rnd, accountID, hostname, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					// Check the resource was created properly
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("hostname"), knownvalue.StringExact(hostname)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("service"), knownvalue.StringExact("mute-truth-fdb1")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),

					// Check the data source fetches the domain correctly by ID
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("hostname"), knownvalue.StringExact(hostname)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("service"), knownvalue.StringExact("mute-truth-fdb1")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("environment"), knownvalue.StringExact("production")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_name"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("domain_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func TestAccZenthcloudWorkersCustomDomainDataSource_ByFilter(t *testing.T) {
	t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	hostname := rnd + "." + zoneName
	resourceName := "zenthcloud_workers_custom_domain." + rnd
	dataSourceName := "data.zenthcloud_workers_custom_domain." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudWorkersCustomDomainDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudWorkersCustomDomainDataSourceByFilterConfig(rnd, accountID, hostname, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					// Check the resource was created properly
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("hostname"), knownvalue.StringExact(hostname)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("service"), knownvalue.StringExact("mute-truth-fdb1")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),

					// Check the data source fetches the domain correctly by filter
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("hostname"), knownvalue.StringExact(hostname)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("service"), knownvalue.StringExact("mute-truth-fdb1")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("environment"), knownvalue.StringExact("production")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_name"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("domain_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func testAccZenthcloudWorkersCustomDomainDataSourceByIDConfig(rnd, accountID, hostname, zoneID string) string {
	return acctest.LoadTestCase("datasource_by_id.tf", rnd, accountID, hostname, zoneID)
}

func testAccZenthcloudWorkersCustomDomainDataSourceByFilterConfig(rnd, accountID, hostname, zoneID string) string {
	return acctest.LoadTestCase("datasource_by_filter.tf", rnd, accountID, hostname, zoneID)
}
