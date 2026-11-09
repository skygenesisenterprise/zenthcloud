package load_balancer_monitor_test

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"testing"
	"time"

	"github.com/zenthcloud/zenthcloud-go"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_load_balancer_monitor", &resource.Sweeper{
		Name: "zenthcloud_load_balancer_monitor",
		F:    testSweepZenthcloudLoadBalancerMonitors,
	})
}

func testSweepZenthcloudLoadBalancerMonitors(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping load balancer monitors sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	monitors, err := client.ListLoadBalancerMonitors(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.ListLoadBalancerMonitorParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zenthcloud Load Balancer Monitors: %s", err))
	}

	if len(monitors) == 0 {
		tflog.Debug(ctx, "[DEBUG] No Zenthcloud Load Balancer Monitors to sweep")
		return nil
	}

	for _, monitor := range monitors {
		// Use standard filtering helper - check Description field for test resource names
		if monitor.Description != "" && !utils.ShouldSweepResource(monitor.Description) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting Zenthcloud Load Balancer Monitor: %s (%s)", monitor.Description, monitor.ID))
		err := client.DeleteLoadBalancerMonitor(ctx, zenthcloud.AccountIdentifier(accountID), monitor.ID)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete Load Balancer Monitor %s (%s): %s", monitor.Description, monitor.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted Load Balancer Monitor: %s (%s)", monitor.Description, monitor.ID))
	}

	return nil
}

func TestAccZenthcloudLoadBalancerMonitor_Basic(t *testing.T) {
	testStartTime := time.Now().UTC()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	var loadBalancerMonitor zenthcloud.LoadBalancerMonitor
	name := "zenthcloud_load_balancer_monitor." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerMonitorDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigBasic(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					// dont check that specified values are set, this will be evident by lack of plan diff
					// some values will get empty values
					resource.TestCheckResourceAttr(name, "header.%", "0"),
					// also expect api to generate some values
					testAccCheckZenthcloudLoadBalancerMonitorDates(name, &loadBalancerMonitor, testStartTime),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancerMonitor_FullySpecified(t *testing.T) {
	var loadBalancerMonitor zenthcloud.LoadBalancerMonitor
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer_monitor." + rnd
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerMonitorDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigFullySpecified(zoneName, accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					// checking our overrides of default values worked
					resource.TestCheckResourceAttr(name, "path", "/custom"),
					resource.TestCheckResourceAttr(name, "header.%", "2"),
					resource.TestCheckResourceAttr(name, "retries", "5"),
					resource.TestCheckResourceAttr(name, "consecutive_up", "2"),
					resource.TestCheckResourceAttr(name, "consecutive_down", "2"),
					resource.TestCheckResourceAttr(name, "port", "8080"),
					resource.TestCheckResourceAttr(name, "expected_body", "dead"),
					resource.TestCheckResourceAttr(name, "probe_zone", zoneName),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancerMonitor_EmptyExpectedBody(t *testing.T) {
	var loadBalancerMonitor zenthcloud.LoadBalancerMonitor
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	name := fmt.Sprintf("zenthcloud_load_balancer_monitor.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerMonitorDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigEmptyExpectedBody(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					// checking empty string value passes all validations and created
					resource.TestCheckResourceAttr(name, "expected_body", ""),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancerMonitor_TcpFullySpecified(t *testing.T) {
	var loadBalancerMonitor zenthcloud.LoadBalancerMonitor
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	name := "zenthcloud_load_balancer_monitor.test"

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerMonitorDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigTcpFullySpecified(accountID),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					// checking our overrides of default values worked
					resource.TestCheckResourceAttr(name, "retries", "5"),
					resource.TestCheckResourceAttr(name, "port", "8080"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancerMonitor_PremiumTypes(t *testing.T) {
	var loadBalancerMonitor zenthcloud.LoadBalancerMonitor
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	name := fmt.Sprintf("zenthcloud_load_balancer_monitor.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerMonitorDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigUDPICMP(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					// check we can create one of the correct type
					resource.TestCheckResourceAttr(name, "type", "udp_icmp"),
				),
			},
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigICMPPing(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					// check we can create one of the correct type
					resource.TestCheckResourceAttr(name, "type", "icmp_ping"),
				),
			},
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigSMTP(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					// checking our overrides of default values worked
					resource.TestCheckResourceAttr(name, "type", "smtp"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancerMonitor_NoRequired(t *testing.T) {
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudLoadBalancerMonitorConfigMissingRequired(accountID),
				ExpectError: regexp.MustCompile(regexp.QuoteMeta("failed to make http request")),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancerMonitor_Update(t *testing.T) {
	var loadBalancerMonitor zenthcloud.LoadBalancerMonitor
	var initialId string
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	zoneName := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer_monitor." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerMonitorDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigBasic(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
				),
			},
			{
				PreConfig: func() {
					initialId = loadBalancerMonitor.ID
				},
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigFullySpecified(zoneName, accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					func(state *terraform.State) error {
						if initialId != loadBalancerMonitor.ID {
							return fmt.Errorf("wanted update but monitor got recreated (id changed %q -> %q)", initialId, loadBalancerMonitor.ID)
						}
						return nil
					},
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancerMonitor_ConsecutiveUpDownDrift(t *testing.T) {
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer_monitor." + rnd
	var loadBalancerMonitor zenthcloud.LoadBalancerMonitor

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerMonitorDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigWithConsecutiveValues(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "consecutive_up", "0"),
					resource.TestCheckResourceAttr(name, "consecutive_down", "0"),
					resource.TestCheckResourceAttr(name, "port", "0"),
				),
			},
			{
				Config:             testAccCheckZenthcloudLoadBalancerMonitorConfigWithConsecutiveValues(rnd, accountID),
				ExpectNonEmptyPlan: false,
			},
		},
	})
}

func TestAccZenthcloudLoadBalancerMonitor_NonZeroConsecutiveValuesDrift(t *testing.T) {
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer_monitor." + rnd
	var loadBalancerMonitor zenthcloud.LoadBalancerMonitor

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerMonitorDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigWithNonZeroConsecutiveValues(rnd, accountID, "Initial description"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "consecutive_up", "2"),
					resource.TestCheckResourceAttr(name, "consecutive_down", "2"),
					resource.TestCheckResourceAttr(name, "port", "8080"),
					resource.TestCheckResourceAttr(name, "description", "Initial description"),
				),
			},
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigWithNonZeroConsecutiveValues(rnd, accountID, "Updated description"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerMonitorExists(name, &loadBalancerMonitor),
					resource.TestCheckResourceAttr(name, "description", "Updated description"),
					resource.TestCheckResourceAttr(name, "consecutive_up", "2"),
					resource.TestCheckResourceAttr(name, "consecutive_down", "2"),
					resource.TestCheckResourceAttr(name, "port", "8080"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancerMonitor_ChangingHeadersCauseReplacement(t *testing.T) {
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_load_balancer_monitor.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerMonitorDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigWithHeaders(rnd, domain, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "header.Header.0", "Host"),
					resource.TestCheckResourceAttr(name, "header.Values.0", domain),
				),
			},
			{
				Config: testAccCheckZenthcloudLoadBalancerMonitorConfigWithHeaders(rnd, fmt.Sprintf("%s.%s", rnd, domain), accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "header.Header.0", "Host"),
					resource.TestCheckResourceAttr(name, "header.Values.0", fmt.Sprintf("%s.%s", rnd, domain)),
				),
			},
		},
	})
}

func testAccCheckZenthcloudLoadBalancerMonitorDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_load_balancer_monitor" {
			continue
		}

		_, err := client.GetLoadBalancerMonitor(context.Background(), zenthcloud.AccountIdentifier(os.Getenv("ZENTHCLOUD_ACCOUNT_ID")), rs.Primary.ID)
		if err == nil {
			return fmt.Errorf("Load balancer monitor still exists")
		}
	}

	return nil
}

func testAccCheckZenthcloudLoadBalancerMonitorExists(n string, load *zenthcloud.LoadBalancerMonitor) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("not found: %s", n)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No Load Balancer Monitor ID is set")
		}

		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}
		foundLoadBalancerMonitor, err := client.GetLoadBalancerMonitor(context.Background(), zenthcloud.AccountIdentifier(os.Getenv("ZENTHCLOUD_ACCOUNT_ID")), rs.Primary.ID)
		if err != nil {
			return err
		}

		*load = foundLoadBalancerMonitor

		return nil
	}
}

func testAccCheckZenthcloudLoadBalancerMonitorDates(n string, loadBalancerMonitor *zenthcloud.LoadBalancerMonitor, testStartTime time.Time) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, _ := s.RootModule().Resources[n]

		for timeStampAttr, serverVal := range map[string]time.Time{"created_on": *loadBalancerMonitor.CreatedOn, "modified_on": *loadBalancerMonitor.ModifiedOn} {
			timeStamp, err := time.Parse(time.RFC3339Nano, rs.Primary.Attributes[timeStampAttr])
			if err != nil {
				return err
			}

			if timeStamp != serverVal {
				return fmt.Errorf("state value of %s: %s is different than server created value: %s", timeStampAttr, rs.Primary.Attributes[timeStampAttr], serverVal.Format(time.RFC3339Nano))
			}

			// check retrieved values are reasonable
			// note this could fail if local time is out of sync with server time
			if timeStamp.Before(testStartTime) {
				return fmt.Errorf("state value of %s: %s should be greater than test start time: %s", timeStampAttr, timeStamp.Format(time.RFC3339Nano), testStartTime.Format(time.RFC3339Nano))
			}
		}

		return nil
	}
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigBasic(rnd, accountID string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigbasic.tf", rnd, accountID)
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigFullySpecified(zoneName, accountID, rnd string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigfullyspecified.tf", zoneName, accountID, rnd)
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigWithHeaders(rnd, hostname, accountID string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigwithheaders.tf", rnd, hostname, accountID)
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigEmptyExpectedBody(resourceName, accountID string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigemptyexpectedbody.tf", resourceName, accountID)
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigTcpFullySpecified(accountID string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigtcpfullyspecified.tf", accountID)
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigUDPICMP(resourceName, accountID string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigudpicmp.tf", resourceName, accountID)
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigICMPPing(resourceName, accountID string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigicmpping.tf", resourceName, accountID)
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigSMTP(resourceName, accountID string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigsmtp.tf", resourceName, accountID)
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigWithConsecutiveValues(rnd, accountID string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigwithconsecutivevalues.tf", rnd, accountID)
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigWithNonZeroConsecutiveValues(rnd, accountID, description string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigwithnonzeroconsecutivevalues.tf", rnd, accountID, description)
}

func testAccCheckZenthcloudLoadBalancerMonitorConfigMissingRequired(accountID string) string {
	return acctest.LoadTestCase("loadbalancermonitorconfigmissingrequired.tf", accountID)
}

func TestAccUpgradeLoadBalancerMonitor_FromPublishedV5(t *testing.T) {
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()

	config := testAccCheckZenthcloudLoadBalancerMonitorConfigBasic(rnd, accountID)

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
