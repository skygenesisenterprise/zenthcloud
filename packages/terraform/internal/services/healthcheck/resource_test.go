package healthcheck_test

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/healthchecks"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_healthcheck", &resource.Sweeper{
		Name: "zenthcloud_healthcheck",
		F:    testSweepZenthcloudHealthcheck,
	})
}

func testSweepZenthcloudHealthcheck(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping healthchecks sweep: ZENTHCLOUD_ZONE_ID not set")
		return nil
	}

	healthchecksList, err := client.Healthchecks.List(ctx, healthchecks.HealthcheckListParams{
		ZoneID: zenthcloud.F(zoneID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch healthchecks: %s", err))
		return fmt.Errorf("failed to fetch healthchecks: %w", err)
	}

	if len(healthchecksList.Result) == 0 {
		tflog.Info(ctx, "No healthchecks to sweep")
		return nil
	}

	for _, healthcheck := range healthchecksList.Result {
		// Use standard filtering helper
		if !utils.ShouldSweepResource(healthcheck.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting healthcheck: %s (%s) (zone: %s)", healthcheck.Name, healthcheck.ID, zoneID))
		_, err := client.Healthchecks.Delete(ctx, healthcheck.ID, healthchecks.HealthcheckDeleteParams{
			ZoneID: zenthcloud.F(zoneID),
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete healthcheck %s: %s", healthcheck.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted healthcheck: %s", healthcheck.ID))
	}

	return nil
}

func TestAccZenthcloudHealthcheck_TCP(t *testing.T) {
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_healthcheck.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudHealthcheckDestroy,
		Steps: []resource.TestStep{
			{
				// Step 1: Create
				Config: testAccZenthcloudHealthcheckTCP(zoneID, rnd, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("address"), knownvalue.StringExact("example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("type"), knownvalue.StringExact("TCP")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("description"), knownvalue.StringExact("TCP healthcheck")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_fails"), knownvalue.Int64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_successes"), knownvalue.Int64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("interval"), knownvalue.Int64Exact(60)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("retries"), knownvalue.Int64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("suspended"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("timeout"), knownvalue.Int64Exact(10)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("tcp_config").AtMapKey("method"), knownvalue.StringExact("connection_established")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("tcp_config").AtMapKey("port"), knownvalue.Int64Exact(80)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
			},
			{
				// Step 2: Update
				Config: testAccZenthcloudHealthcheckTCPUpdated(zoneID, rnd+"-updated", rnd),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd+"-updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("description"), knownvalue.StringExact("TCP healthcheck updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_fails"), knownvalue.Int64Exact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_successes"), knownvalue.Int64Exact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("interval"), knownvalue.Int64Exact(120)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("retries"), knownvalue.Int64Exact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("suspended"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("timeout"), knownvalue.Int64Exact(15)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("tcp_config").AtMapKey("method"), knownvalue.StringExact("connection_established")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("tcp_config").AtMapKey("port"), knownvalue.Int64Exact(8080)),
				},
			},
			{
				// Step 3: Import
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", zoneID),
				ImportStateVerifyIgnore: []string{"check_regions", "description", "created_on", "modified_on", "status", "failure_reason", "http_config"},
			},
		},
	})
}

func TestAccZenthcloudHealthcheck_HTTP(t *testing.T) {
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_healthcheck.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudHealthcheckDestroy,
		Steps: []resource.TestStep{
			{
				// Step 1: Create
				Config: testAccZenthcloudHealthcheckHTTP(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("address"), knownvalue.StringExact("example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("type"), knownvalue.StringExact("HTTP")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("description"), knownvalue.StringExact("HTTP healthcheck")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_fails"), knownvalue.Int64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_successes"), knownvalue.Int64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("interval"), knownvalue.Int64Exact(60)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("retries"), knownvalue.Int64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("suspended"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("timeout"), knownvalue.Int64Exact(5)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("allow_insecure"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("expected_body"), knownvalue.StringExact("OK")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("follow_redirects"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("header"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("method"), knownvalue.StringExact("GET")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("path"), knownvalue.StringExact("/health")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("port"), knownvalue.Int64Exact(80)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
			},
			{
				// Step 2: Update
				Config: testAccZenthcloudHealthcheckHTTPUpdated(zoneID, rnd),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd+"-updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("description"), knownvalue.StringExact("HTTP healthcheck updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_fails"), knownvalue.Int64Exact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_successes"), knownvalue.Int64Exact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("interval"), knownvalue.Int64Exact(120)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("retries"), knownvalue.Int64Exact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("suspended"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("timeout"), knownvalue.Int64Exact(10)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("allow_insecure"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("expected_body"), knownvalue.StringExact("HEALTHY")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("follow_redirects"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("method"), knownvalue.StringExact("HEAD")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("path"), knownvalue.StringExact("/ping")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("port"), knownvalue.Int64Exact(8080)),
				},
			},
			{
				// Step 3: Import
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", zoneID),
				ImportStateVerifyIgnore: []string{"check_regions", "description", "created_on", "modified_on", "status", "failure_reason", "http_config"},
			},
		},
	})
}

func TestAccZenthcloudHealthcheckMissingRequired(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckHealthcheckConfigMissingRequired(zoneID, rnd),
				ExpectError: regexp.MustCompile(regexp.QuoteMeta("The argument \"name\" is required, but no definition was found.")),
			},
		},
	})
}

func TestAccZenthcloudHealthcheck_HTTPS(t *testing.T) {
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_healthcheck.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudHealthcheckDestroy,
		Steps: []resource.TestStep{
			{
				// Step 1: Create with all attributes
				Config: testAccZenthcloudHealthcheckHTTPS(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("address"), knownvalue.StringExact("example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("type"), knownvalue.StringExact("HTTPS")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("description"), knownvalue.StringExact("HTTPS healthcheck")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_fails"), knownvalue.Int64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_successes"), knownvalue.Int64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("interval"), knownvalue.Int64Exact(60)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("retries"), knownvalue.Int64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("timeout"), knownvalue.Int64Exact(10)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("suspended"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("allow_insecure"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("expected_body"), knownvalue.StringExact("OK")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("follow_redirects"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("method"), knownvalue.StringExact("GET")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("path"), knownvalue.StringExact("/health")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("port"), knownvalue.Int64Exact(443)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("header"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
			},
			{
				// Step 2: Update all mutable attributes
				Config: testAccZenthcloudHealthcheckHTTPSUpdated(zoneID, rnd),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd+"-updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("description"), knownvalue.StringExact("HTTPS healthcheck updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("check_regions"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.StringExact("WNAM"),
					})),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_fails"), knownvalue.Int64Exact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("consecutive_successes"), knownvalue.Int64Exact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("interval"), knownvalue.Int64Exact(120)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("retries"), knownvalue.Int64Exact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("timeout"), knownvalue.Int64Exact(5)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("suspended"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("allow_insecure"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("expected_body"), knownvalue.StringExact("HEALTHY")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("expected_codes"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.StringExact("200"),
					})),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("follow_redirects"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("method"), knownvalue.StringExact("HEAD")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("path"), knownvalue.StringExact("/status")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("port"), knownvalue.Int64Exact(8443)),
				},
			},
			{
				// Step 3: Import
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", zoneID),
				ImportStateVerifyIgnore: []string{"check_regions", "description", "created_on", "modified_on", "status", "failure_reason", "http_config"},
			},
		},
	})
}

func testAccCheckZenthcloudHealthcheckDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_healthcheck" {
			continue
		}

		zoneID := rs.Primary.Attributes[consts.ZoneIDSchemaKey]
		_, err := client.Healthchecks.Get(
			context.Background(),
			rs.Primary.ID,
			healthchecks.HealthcheckGetParams{
				ZoneID: zenthcloud.F(zoneID),
			},
		)
		if err == nil {
			return fmt.Errorf("healthcheck still exists")
		}
	}

	return nil
}

func testAccCheckHealthcheckConfigMissingRequired(zoneID, ID string) string {
	return acctest.LoadTestCase("acccheckhealthcheckconfigmissingrequired.tf", zoneID, ID)
}

func testAccZenthcloudHealthcheckTCP(zoneID, name, ID string) string {
	return acctest.LoadTestCase("tcp.tf", zoneID, name, ID)
}

func testAccZenthcloudHealthcheckTCPUpdated(zoneID, name, ID string) string {
	return acctest.LoadTestCase("tcp_updated.tf", zoneID, name, ID)
}

func testAccZenthcloudHealthcheckHTTP(zoneID, name string) string {
	return acctest.LoadTestCase("http.tf", zoneID, name)
}

func testAccZenthcloudHealthcheckHTTPUpdated(zoneID, name string) string {
	return acctest.LoadTestCase("http_updated.tf", zoneID, name)
}

func testAccZenthcloudHealthcheckHTTPS(zoneID, name string) string {
	return acctest.LoadTestCase("https.tf", zoneID, name)
}

func testAccZenthcloudHealthcheckHTTPSUpdated(zoneID, name string) string {
	return acctest.LoadTestCase("https_updated.tf", zoneID, name)
}

// TestAccZenthcloudHealthcheck_ExpectedBodyDefaultNoDiff verifies that when expected_body
// is not specified in the config, the schema default of "" is used, matching the API response.
// This test validates that expected_body does not cause a plan diff.
func TestAccZenthcloudHealthcheck_ExpectedBodyDefaultNoDiff(t *testing.T) {
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_healthcheck.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudHealthcheckDestroy,
		Steps: []resource.TestStep{
			{
				// Create the resource without specifying expected_body
				Config: testAccCheckZenthcloudHealthcheck_HTTPNoExpectedBody(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("type"), knownvalue.StringExact("HTTP")),
					// Verify expected_body defaults to "" (empty string) matching API response
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("expected_body"), knownvalue.StringExact("")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
			},
			{
				// Re-apply same config - verifies expected_body specifically doesn't cause additional drift
				Config: testAccCheckZenthcloudHealthcheck_HTTPNoExpectedBody(zoneID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("http_config").AtMapKey("expected_body"), knownvalue.StringExact("")),
				},
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", zoneID),
				ImportStateVerifyIgnore: []string{"check_regions", "description", "created_on", "modified_on", "status", "failure_reason", "tcp_config"},
			},
		},
	})
}

func testAccCheckZenthcloudHealthcheck_HTTPNoExpectedBody(zoneID, name string) string {
	return acctest.LoadTestCase("http_no_expected_body.tf", zoneID, name)
}

func TestAccUpgradeHealthcheck_FromPublishedV5(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()

	config := testAccZenthcloudHealthcheckTCP(zoneID, rnd, rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() { acctest.TestAccPreCheck(t) },
		Steps: []resource.TestStep{
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.16.0",
					},
				},
				Config: config,
			},
			{
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Config:                   config,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}
