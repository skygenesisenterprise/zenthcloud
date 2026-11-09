package logpush_dataset_field_test

import (
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudLogpushDatasetFieldDataSource_AccountID(t *testing.T) {
	t.Parallel()
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	dataSourceName := fmt.Sprintf("data.zenthcloud_logpush_dataset_field.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudLogpushDatasetFieldDataSourceConfig_AccountID(rnd, accountID, "http_requests"),
				ConfigStateChecks: []statecheck.StateCheck{
					// Verify the input parameters are set correctly
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("dataset_id"), knownvalue.StringExact("http_requests")),
					// Verify zone_id is not set (mutually exclusive)
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_id"), knownvalue.Null()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("fields").AtMapKey("Datetime"), knownvalue.StringRegexp(regexp.MustCompile(`.+`))),
				},
			},
		},
	})
}

func TestAccZenthcloudLogpushDatasetFieldDataSource_ZoneID(t *testing.T) {
	t.Parallel()
	rnd := utils.GenerateRandomResourceName()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	dataSourceName := fmt.Sprintf("data.zenthcloud_logpush_dataset_field.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudLogpushDatasetFieldDataSourceConfig_ZoneID(rnd, zoneID, "firewall_events"),
				ConfigStateChecks: []statecheck.StateCheck{
					// Verify the input parameters are set correctly
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("dataset_id"), knownvalue.StringExact("firewall_events")),
					// Verify account_id is not set (mutually exclusive)
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("account_id"), knownvalue.Null()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("fields").AtMapKey("Datetime"), knownvalue.StringRegexp(regexp.MustCompile(`.+`))),
				},
			},
		},
	})
}

// Helper functions to generate test configurations
func testAccZenthcloudLogpushDatasetFieldDataSourceConfig_AccountID(rnd, accountID, datasetID string) string {
	return fmt.Sprintf(`
data "zenthcloud_logpush_dataset_field" "%[1]s" {
  account_id = "%[2]s"
  dataset_id = "%[3]s"
}
`, rnd, accountID, datasetID)
}

func testAccZenthcloudLogpushDatasetFieldDataSourceConfig_ZoneID(rnd, zoneID, datasetID string) string {
	return fmt.Sprintf(`
data "zenthcloud_logpush_dataset_field" "%[1]s" {
  zone_id    = "%[2]s"
  dataset_id = "%[3]s"
}
`, rnd, zoneID, datasetID)
}
