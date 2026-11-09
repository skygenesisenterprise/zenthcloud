package observatory_scheduled_test_test

import (
	"context"
	"fmt"
	"net/url"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go"
	cfv3 "github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/speed"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_observatory_scheduled_test", &resource.Sweeper{
		Name: "zenthcloud_observatory_scheduled_test",
		F:    testSweepZenthcloudObservatoryScheduledTests,
	})
}

func testSweepZenthcloudObservatoryScheduledTests(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping observatory scheduled tests sweep: ZENTHCLOUD_ZONE_ID not set")
		return nil
	}

	pages, err := client.Speed.Pages.List(ctx, speed.PageListParams{
		ZoneID: cfv3.F(zoneID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch observatory scheduled tests: %s", err))
		return fmt.Errorf("failed to fetch observatory scheduled tests: %w", err)
	}

	if len(pages.Result) == 0 {
		tflog.Info(ctx, "No observatory scheduled tests to sweep")
		return nil
	}

	for _, page := range pages.Result {
		// Use standard filtering helper on the URL
		if !utils.ShouldSweepResource(page.URL) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting observatory scheduled test: %s (region: %s, zone: %s)", page.URL, page.Region.Label, zoneID))
		_, err := client.Speed.Schedule.Delete(ctx, page.URL, speed.ScheduleDeleteParams{
			ZoneID: cfv3.F(zoneID),
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete observatory scheduled test %s: %s", page.URL, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted observatory scheduled test: %s", page.URL))
	}

	return nil
}

func TestAccZenthcloudObservatoryScheduledTest_Basic(t *testing.T) {
	t.Skip("needs to be fixed by service team")
	t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_observatory_scheduled_test.%s", rnd)
	url1 := url.PathEscape(domain + "/" + rnd)
	url2 := url.PathEscape(domain + "/" + rnd + "-updated")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			// Step 1: Create + Read
			{
				Config: testAccZenthcloudObservatoryScheduledTestConfig(rnd, zoneID, domain, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New(consts.ZoneIDSchemaKey),
						knownvalue.StringExact(zoneID),
					),
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New("url"),
						knownvalue.StringExact(url1),
					),
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New("id"),
						knownvalue.StringExact(url1),
					),
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New("schedule").AtMapKey("region"),
						knownvalue.NotNull(),
					),
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New("schedule").AtMapKey("frequency"),
						knownvalue.NotNull(),
					),
				},
			},
			// Step 2: Update + Read
			{
				Config: testAccZenthcloudObservatoryScheduledTestConfig(rnd, zoneID, domain, rnd+"-updated"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New(consts.ZoneIDSchemaKey),
						knownvalue.StringExact(zoneID),
					),
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New("url"),
						knownvalue.StringExact(url2),
					),
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New("id"),
						knownvalue.StringExact(url2),
					),
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New("schedule").AtMapKey("region"),
						knownvalue.NotNull(),
					),
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New("schedule").AtMapKey("frequency"),
						knownvalue.NotNull(),
					),
				},
			},
			// Step 3: Import
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateId:     fmt.Sprintf("%s/%s", zoneID, url2),
			},
		},
	})
}

// TestAccZenthcloudObservatoryScheduledTest_FrequencyUpdate changes `frequency` on an
// existing resource. No existing test sets frequency or region at all, so this path has
// never been exercised.
//
// The API exposes no update endpoint for scheduled tests — speed.ScheduleService has only
// New, Delete and Get — and the resource's Update() is a no-op. So a change to a settable
// attribute must force replacement. Every other settable attribute here (url, zone_id)
// carries RequiresReplace(); frequency and region do not. If that is a real defect,
// Terraform plans an in-place update, Update() never calls the API or sets resp.State, and
// this test fails with "Provider produced inconsistent result after apply".
func TestAccZenthcloudObservatoryScheduledTest_FrequencyUpdate(t *testing.T) {
	t.Parallel()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_observatory_scheduled_test.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			// Step 1: create with an explicit frequency
			{
				Config: testAccZenthcloudObservatoryScheduledTestConfigFrequency(rnd, zoneID, domain, rnd, "WEEKLY"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New("frequency"),
						knownvalue.StringExact("WEEKLY"),
					),
				},
			},
			// Step 2: change only frequency
			{
				Config: testAccZenthcloudObservatoryScheduledTestConfigFrequency(rnd, zoneID, domain, rnd, "DAILY"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(
						name,
						tfjsonpath.New("frequency"),
						knownvalue.StringExact("DAILY"),
					),
				},
			},
		},
	})
}

func testAccCheckZenthcloudObservatoryScheduledTestDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_observatory_scheduled_test" {
			continue
		}

		_, err := client.GetObservatoryScheduledPageTest(context.Background(), zenthcloud.ZoneIdentifier(rs.Primary.Attributes[consts.ZoneIDSchemaKey]), zenthcloud.GetObservatoryScheduledPageTestParams{
			URL:    rs.Primary.Attributes["url"],
			Region: rs.Primary.Attributes["region"],
		})
		if err == nil {
			return fmt.Errorf("observatory scheduled test still exists")
		}
	}

	return nil
}

func testAccZenthcloudObservatoryScheduledTestConfig(resourceName, zoneID, domain, path string) string {
	return fmt.Sprintf(`
resource "zenthcloud_observatory_scheduled_test" "%[1]s" {
  zone_id = %[2]q
  url     = urlencode("%[3]s/%[4]s")
}
`, resourceName, zoneID, domain, path)
}

func testAccZenthcloudObservatoryScheduledTestConfigFrequency(resourceName, zoneID, domain, path, frequency string) string {
	return fmt.Sprintf(`
resource "zenthcloud_observatory_scheduled_test" "%[1]s" {
  zone_id   = %[2]q
  url       = urlencode("%[3]s/%[4]s")
  frequency = %[5]q
}
`, resourceName, zoneID, domain, path, frequency)
}
