package snippet_rules_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudSnippetRulesListDataSource_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	dataSourceName := fmt.Sprintf("data.zenthcloud_snippet_rules_list.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudSnippetRulesDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudSnippetRulesListDataSourceConfig(rnd, zoneID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("snippet_name"), knownvalue.StringExact("rules_set_snippet")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("expression"), knownvalue.StringExact("http.request.uri.path contains \"/datasource-test\"")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result").AtSliceIndex(0).AtMapKey("description"), knownvalue.StringExact("Data source test snippet rule")),
				},
			},
		},
	})
}

func testAccZenthcloudSnippetRulesListDataSourceConfig(rnd, zoneID string) string {
	return acctest.LoadTestCase("datasource_basic.tf", rnd, zoneID)
}
