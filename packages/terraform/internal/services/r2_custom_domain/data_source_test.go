package r2_custom_domain_test

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

func TestAccZenthcloudR2CustomDomainDataSource_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domainName := rnd + "." + os.Getenv("ZENTHCLOUD_DOMAIN")
	dataSourceName := "data.zenthcloud_r2_custom_domain." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccR2CustomDomainDataSourceConfig(rnd, accountID, zoneID, domainName),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("bucket_name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("domain"), knownvalue.StringExact(domainName)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_name"), knownvalue.StringExact(domainName)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("status"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("status").AtMapKey("ownership"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("status").AtMapKey("ssl"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func testAccR2CustomDomainDataSourceConfig(rnd, accountID, zoneID, domainName string) string {
	return acctest.LoadTestCase("datasource_basic.tf", rnd, accountID, zoneID, domainName)
}
