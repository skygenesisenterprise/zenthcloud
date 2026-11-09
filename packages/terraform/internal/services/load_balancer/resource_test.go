package load_balancer_test

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	cfold "github.com/zenthcloud/zenthcloud-go"
	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/load_balancers"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

var (
	accountID = os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
)

func init() {
	resource.AddTestSweepers("zenthcloud_load_balancer", &resource.Sweeper{
		Name: "zenthcloud_load_balancer",
		F:    testSweepZenthcloudLoadBalancer,
	})
}

func testSweepZenthcloudLoadBalancer(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping load balancers sweep: ZENTHCLOUD_ZONE_ID not set")
		return nil
	}

	lbs, err := client.ListLoadBalancers(ctx, cfold.ZoneIdentifier(zoneID), cfold.ListLoadBalancerParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zenthcloud Load Balancers: %s", err))
		return err
	}

	if len(lbs) == 0 {
		tflog.Debug(ctx, "[DEBUG] No Zenthcloud Load Balancers to sweep")
		return nil
	}

	tflog.Debug(ctx, fmt.Sprintf("[DEBUG] Found %d Zenthcloud Load Balancers to sweep", len(lbs)))

	// Track deletion results
	deleted := 0
	failed := 0

	for _, lb := range lbs {
		// Use standard filtering helper
		if !utils.ShouldSweepResource(lb.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting Zenthcloud Load Balancer: %s (%s)", lb.Name, lb.ID))

		err := client.DeleteLoadBalancer(ctx, cfold.ZoneIdentifier(zoneID), lb.ID)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete Load Balancer %s (%s): %s", lb.Name, lb.ID, err))
			failed++
			// Continue with other load balancers
		} else {
			tflog.Info(ctx, fmt.Sprintf("Deleted Load Balancer: %s (%s)", lb.Name, lb.ID))
			deleted++
		}
	}

	tflog.Debug(ctx, fmt.Sprintf("[DEBUG] Load Balancer sweep completed: %d deleted, %d failed", deleted, failed))
	return nil
}

func TestAccZenthcloudLoadBalancer_Basic(t *testing.T) {
	testStartTime := time.Now().UTC()
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigBasic(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// dont check that specified values are set, this will be evident by lack of plan diff
					// some values will get empty values
					resource.TestCheckResourceAttr(name, "pop_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "country_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "region_pools.#", "0"),
					// also expect api to generate some values
					testAccCheckZenthcloudLoadBalancerDates(name, &loadBalancer, testStartTime),
					resource.TestCheckResourceAttr(name, "proxied", "false"), // default value
					resource.TestCheckResourceAttr(name, "ttl", "30"),
					resource.TestCheckResourceAttr(name, "steering_policy", "off"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_SessionAffinity(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigSessionAffinity(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// explicitly verify that our session_affinity has been set
					resource.TestCheckResourceAttr(name, "session_affinity", "cookie"),
					resource.TestCheckResourceAttr(name, "session_affinity_ttl", "1800"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.samesite", "Auto"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.secure", "Auto"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.drain_duration", "60"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.zero_downtime_failover", "sticky"),
					// dont check that other specified values are set, this will be evident by lack
					// of plan diff some values will get empty values
					resource.TestCheckResourceAttr(name, "pop_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "country_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "region_pools.#", "0"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_SessionAffinityIPCookie(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigSessionAffinityIPCookie(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// explicitly verify that our session_affinity has been set
					resource.TestCheckResourceAttr(name, "session_affinity", "ip_cookie"),
					// session_affinity_ttl should be present and set to its default
					resource.TestCheckResourceAttr(name, "session_affinity_ttl", "82800"),
					// session_affinity_attributes should be present and defaults set
					//resource.TestCheckResourceAttr(name, "session_affinity_attributes.%", "4"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.drain_duration", "0"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.samesite", "Auto"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.secure", "Auto"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.zero_downtime_failover", "none"),
					// dont check that other specified values are set, this will be evident by lack
					// of plan diff some values will get empty values
					resource.TestCheckResourceAttr(name, "pop_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "region_pools.#", "0"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_SessionAffinityHeader(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigSessionAffinityHeader(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// explicitly verify that our session_affinity has been set
					resource.TestCheckResourceAttr(name, "session_affinity", "header"),
					resource.TestCheckResourceAttr(name, "session_affinity_ttl", "1800"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.%", "6"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.samesite", "Auto"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.secure", "Auto"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.drain_duration", "60"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.zero_downtime_failover", "temporary"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.headers.#", "1"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.headers.0", "x-custom"),
					resource.TestCheckResourceAttr(name, "session_affinity_attributes.require_all_headers", "true"),
					// dont check that other specified values are set, this will be evident by lack
					// of plan diff some values will get empty values
					resource.TestCheckResourceAttr(name, "pop_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "country_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "region_pools.#", "0"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_AdaptiveRouting(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigAdaptiveRouting(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// explicitly verify that adaptive_routing has been set
					resource.TestCheckResourceAttr(name, "adaptive_routing.%", "1"),
					resource.TestCheckResourceAttr(name, "adaptive_routing.failover_across_pools", "true"),
					// dont check that other specified values are set, this will be evident by lack
					// of plan diff some values will get empty values
					resource.TestCheckResourceAttr(name, "pop_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "country_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "region_pools.#", "0"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_LocationStrategy(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigLocationStrategy(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// explicitly verify that location_strategy has been set
					resource.TestCheckResourceAttr(name, "location_strategy.%", "2"),
					resource.TestCheckResourceAttr(name, "location_strategy.prefer_ecs", "proximity"),
					resource.TestCheckResourceAttr(name, "location_strategy.mode", "pop"),
					// dont check that other specified values are set, this will be evident by lack
					// of plan diff some values will get empty values
					resource.TestCheckResourceAttr(name, "pop_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "country_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "region_pools.#", "0"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_RandomSteering(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigRandomSteering(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// explicitly verify that random_steering has been set
					resource.TestCheckResourceAttr(name, "random_steering.%", "2"),                   // random_steering appears once
					resource.TestCheckResourceAttr(name, "random_steering.pool_weights.%", "1"),      // one pool configured
					resource.TestCheckTypeSetElemAttr(name, "random_steering.pool_weights.*", "0.3"), // pool weight of 0.3
					resource.TestCheckResourceAttr(name, "random_steering.default_weight", "0.9"),    // default weight of 0.9
					// dont check that other specified values are set, this will be evident by lack
					// of plan diff some values will get empty values
					resource.TestCheckResourceAttr(name, "pop_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "country_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "region_pools.#", "0"),
				),
			},
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigRandomSteeringUpdate(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// explicitly verify that random_steering has been set
					resource.TestCheckResourceAttr(name, "random_steering.%", "2"),                   // random_steering appears once
					resource.TestCheckResourceAttr(name, "random_steering.pool_weights.%", "1"),      // one pool configured
					resource.TestCheckTypeSetElemAttr(name, "random_steering.pool_weights.*", "0.4"), // pool weight of 0.4
					resource.TestCheckResourceAttr(name, "random_steering.default_weight", "0.8"),    // default weight of 0.8
					// dont check that other specified values are set, this will be evident by lack
					// of plan diff some values will get empty values
					resource.TestCheckResourceAttr(name, "pop_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "country_pools.#", "0"),
					resource.TestCheckResourceAttr(name, "region_pools.#", "0"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_GeoBalancedUpdate(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigGeoBalancedPoPCountry(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// checking our overrides of default values worked
					resource.TestCheckResourceAttr(name, "description", "tf-acctest load balancer using pop/country geo-balancing"),
					resource.TestCheckResourceAttr(name, "proxied", "true"),
					resource.TestCheckResourceAttr(name, "ttl", "30"),
					resource.TestCheckResourceAttr(name, "steering_policy", "geo"),
					resource.TestCheckResourceAttr(name, "pop_pools.%", "1"),
					resource.TestCheckResourceAttr(name, "country_pools.%", "1"),
					resource.TestCheckResourceAttr(name, "region_pools.%", "0"),
				),
			},
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigGeoBalancedPoPCountryToRegionUpdate(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// checking our updates to geo steering with only a region defined worked
					resource.TestCheckResourceAttr(name, "description", "tf-acctest load balancer using pop/country geo-balancing updated to region geo-balancing"),
					resource.TestCheckResourceAttr(name, "proxied", "true"),
					resource.TestCheckResourceAttr(name, "ttl", "30"),
					resource.TestCheckResourceAttr(name, "steering_policy", "geo"),
					resource.TestCheckResourceAttr(name, "pop_pools.%", "0"),
					resource.TestCheckResourceAttr(name, "country_pools.%", "0"),
					resource.TestCheckResourceAttr(name, "region_pools.%", "1"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_GeoBalanced(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigGeoBalanced(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// checking our overrides of default values worked
					resource.TestCheckResourceAttr(name, "description", "tf-acctest load balancer using geo-balancing"),
					resource.TestCheckResourceAttr(name, "proxied", "true"),
					resource.TestCheckResourceAttr(name, "ttl", "30"),
					resource.TestCheckResourceAttr(name, "steering_policy", "geo"),
					resource.TestCheckResourceAttr(name, "pop_pools.%", "1"),
					resource.TestCheckResourceAttr(name, "country_pools.%", "1"),
					resource.TestCheckResourceAttr(name, "region_pools.%", "1"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_ProximityBalanced(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigProximityBalanced(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// checking our overrides of default values worked
					resource.TestCheckResourceAttr(name, "description", "tf-acctest load balancer using proximity-balancing"),
					resource.TestCheckResourceAttr(name, "proxied", "true"),
					resource.TestCheckResourceAttr(name, "ttl", "30"),
					resource.TestCheckResourceAttr(name, "steering_policy", "proximity"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_LeastOutstandingRequestsBalanced(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigLeastOutstandingRequestsBalanced(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// checking our overrides of default values worked
					resource.TestCheckResourceAttr(name, "description", "tf-acctest load balancer using least outstanding requests steering"),
					resource.TestCheckResourceAttr(name, "proxied", "true"),
					resource.TestCheckResourceAttr(name, "ttl", "30"),
					resource.TestCheckResourceAttr(name, "steering_policy", "least_outstanding_requests"),
					resource.TestCheckResourceAttr(name, "rules.0.name", "test rule 1"),
					resource.TestCheckResourceAttr(name, "rules.0.condition", "dns.qry.type == 28"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.steering_policy", "least_outstanding_requests"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_LeastConnectionsBalanced(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigLeastConnectionsBalanced(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// checking our overrides of default values worked
					resource.TestCheckResourceAttr(name, "description", "tf-acctest load balancer using least connections steering"),
					resource.TestCheckResourceAttr(name, "proxied", "true"),
					resource.TestCheckResourceAttr(name, "ttl", "30"),
					resource.TestCheckResourceAttr(name, "steering_policy", "least_connections"),
					resource.TestCheckResourceAttr(name, "rules.0.name", "test rule 1"),
					resource.TestCheckResourceAttr(name, "rules.0.condition", "dns.qry.type == 28"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.steering_policy", "least_connections"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_AdaptiveRoutingFailoverFalse(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{{
			Config: testAccCheckZenthcloudLoadBalancerConfigAdaptiveRoutingFailoverFalse(zoneID, zone, rnd),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
				testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
			),
		}},
	})
}

func TestAccZenthcloudLoadBalancer_AdaptiveRoutingFailoverTrue(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{{
			Config: testAccCheckZenthcloudLoadBalancerConfigAdaptiveRoutingFailoverTrue(zoneID, zone, rnd),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
				testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
			),
		}},
	})
}

func TestAccZenthcloudLoadBalancer_CountryPools(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{{
			Config: testAccCheckZenthcloudLoadBalancerConfigCountryPools(zoneID, zone, rnd),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
				testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
			),
		}},
	})
}

func TestAccZenthcloudLoadBalancer_CustomLocationStrategy(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{{
			Config: testAccCheckZenthcloudLoadBalancerConfigCustomLocationStrategy(zoneID, zone, rnd),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
				testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
			),
		}},
	})
}

func TestAccZenthcloudLoadBalancer_CustomPort(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{{
			Config: testAccCheckZenthcloudLoadBalancerConfigCustomPort(zoneID, zone, rnd),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
				testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
			),
		}},
	})
}

func TestAccZenthcloudLoadBalancer_CustomSessionAffinityAttributes(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{{
			Config: testAccCheckZenthcloudLoadBalancerConfigCustomSessionAffinityAttributes(zoneID, zone, rnd),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
				testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
			),
		}},
	})
}

func TestAccZenthcloudLoadBalancer_CustomTTL(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{{
			Config: testAccCheckZenthcloudLoadBalancerConfigCustomTTL(zoneID, zone, rnd),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
				testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
			),
		}},
	})
}

func TestAccZenthcloudLoadBalancer_LocationStrategyAlwaysResolverIP(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{{
			Config: testAccCheckZenthcloudLoadBalancerConfigLocationStrategyAlwaysResolverIP(zoneID, zone, rnd),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
				testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
			),
		}},
	})
}

func TestAccZenthcloudLoadBalancer_LocationStrategyNeverPop(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{{
			Config: testAccCheckZenthcloudLoadBalancerConfigLocationStrategyNeverPop(zoneID, zone, rnd),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
				testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
			),
		}},
	})
}

func TestAccZenthcloudLoadBalancer_StandardZone(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{{
			Config: testAccCheckZenthcloudLoadBalancerConfigStandardZone(zoneID, zone, rnd),
			Check: resource.ComposeTestCheckFunc(
				testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
				testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
			),
		}},
	})
}

func TestAccZenthcloudLoadBalancer_Rules(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigRules(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					// checking our overrides of default values worked
					resource.TestCheckResourceAttr(name, "description", "rules lb"),
					resource.TestCheckResourceAttr(name, "rules.0.name", "test rule 1"),
					resource.TestCheckResourceAttr(name, "rules.0.condition", "dns.qry.type == 28"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.steering_policy", "geo"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.session_affinity_attributes.samesite", "Auto"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.session_affinity_attributes.secure", "Auto"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.session_affinity_attributes.zero_downtime_failover", "sticky"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.adaptive_routing.%", "1"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.adaptive_routing.failover_across_pools", "true"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.location_strategy.%", "2"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.location_strategy.prefer_ecs", "always"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.location_strategy.mode", "resolver_ip"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.random_steering.pool_weights.%", "1"),
					resource.TestCheckTypeSetElemAttr(name, "rules.0.overrides.random_steering.pool_weights.*", "0.4"),
					resource.TestCheckResourceAttr(name, "rules.0.overrides.random_steering.default_weight", "0.2"),
					resource.TestCheckResourceAttr(name, "rules.#", "3"),
					resource.TestCheckResourceAttr(name, "rules.1.fixed_response.message_body", "hello"),
					resource.TestCheckResourceAttr(name, "rules.2.overrides.region_pools.%", "1"),
				),
			},
		},
	})
}

func TestAccZenthcloudLoadBalancer_Update(t *testing.T) {
	var loadBalancer cfold.LoadBalancer
	var initialId string
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_load_balancer." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudLoadBalancerDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudLoadBalancerConfigBasic(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
				),
			},
			{
				PreConfig: func() {
					initialId = loadBalancer.ID
				},
				Config: testAccCheckZenthcloudLoadBalancerConfigGeoBalanced(zoneID, zone, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudLoadBalancerExists(name, &loadBalancer),
					testAccCheckZenthcloudLoadBalancerIDIsValid(name, zoneID),
					func(state *terraform.State) error {
						if initialId != loadBalancer.ID {
							// want in place update
							return fmt.Errorf("load balancer id is different after second config applied ( %s -> %s )", initialId, loadBalancer.ID)
						}
						return nil
					},
				),
			},
		},
	})
}

func testAccCheckZenthcloudLoadBalancerDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_load_balancer" {
			continue
		}

		_, err := client.LoadBalancers.Get(context.Background(), rs.Primary.ID, load_balancers.LoadBalancerGetParams{
			ZoneID: zenthcloud.F(rs.Primary.Attributes[consts.ZoneIDSchemaKey]),
		})
		if err == nil {
			return fmt.Errorf("load balancer still exists: %s", rs.Primary.ID)
		}
	}

	return nil
}

func testAccCheckZenthcloudLoadBalancerExists(n string, loadBalancer *cfold.LoadBalancer) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("not found: %s", n)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No Load Balancer ID is set")
		}

		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}
		foundLoadBalancer, err := client.GetLoadBalancer(context.Background(), cfold.ZoneIdentifier(rs.Primary.Attributes[consts.ZoneIDSchemaKey]), rs.Primary.ID)
		if err != nil {
			return err
		}

		*loadBalancer = foundLoadBalancer

		return nil
	}
}

func testAccCheckZenthcloudLoadBalancerIDIsValid(n, expectedZoneID string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("not found: %s", n)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No ID is set")
		}

		if len(rs.Primary.ID) != 32 {
			return fmt.Errorf("invalid id %q, should be a string of length 32", rs.Primary.ID)
		}

		if rs.Primary.Attributes[consts.ZoneIDSchemaKey] != expectedZoneID {
			return fmt.Errorf("zoneID attribute %q doesn't match the expected value %q", rs.Primary.Attributes[consts.ZoneIDSchemaKey], expectedZoneID)
		}

		return nil
	}
}

func testAccCheckZenthcloudLoadBalancerDates(n string, loadBalancer *cfold.LoadBalancer, testStartTime time.Time) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, _ := s.RootModule().Resources[n]

		for timeStampAttr, serverVal := range map[string]time.Time{"created_on": *loadBalancer.CreatedOn, "modified_on": *loadBalancer.ModifiedOn} {
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

func testAccManuallyDeleteLoadBalancer(name string, loadBalancerID string, initialId *string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, _ := s.RootModule().Resources[name]
		_, err := acctest.SharedClient().LoadBalancers.Delete(
			context.Background(),
			loadBalancerID,
			load_balancers.LoadBalancerDeleteParams{
				ZoneID: zenthcloud.F(rs.Primary.Attributes[consts.ZoneIDSchemaKey]),
			},
		)
		if err != nil {
			return err
		}
		return nil
	}
}

func testAccCheckZenthcloudLoadBalancerConfigBasic(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigbasic.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigSessionAffinity(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigsessionaffinity.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigSessionAffinityIPCookie(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigsessionaffinityipcookie.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigSessionAffinityHeader(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigsessionaffinityheader.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigAdaptiveRouting(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigadaptiverouting.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigLocationStrategy(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfiglocationstrategy.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigRandomSteering(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigrandomsteering.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigRandomSteeringUpdate(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigrandomsteeringupdate.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigGeoBalanced(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfiggeobalanced.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigGeoBalancedPoPCountry(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfiggeobalancedpopcountry.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigGeoBalancedPoPCountryToRegionUpdate(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfiggeobalancedpopcountrytoregionupdate.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigProximityBalanced(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigproximitybalanced.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigLeastOutstandingRequestsBalanced(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigleastoutstandingrequestsbalanced.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigLeastConnectionsBalanced(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigleastconnectionsbalanced.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigDuplicatePool(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigduplicatepool.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigAdaptiveRoutingFailoverFalse(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigadaptiveroutingfailoverfalse.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigAdaptiveRoutingFailoverTrue(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigadaptiveroutingfailovertrue.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigCountryPools(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigcountrypools.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigCustomLocationStrategy(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigcustomlocationstrategy.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigCustomPort(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigcustomport.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigCustomSessionAffinityAttributes(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigcustomsessionaffinityattributes.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigCustomTTL(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigcustomttl.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigLocationStrategyAlwaysResolverIP(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfiglocationstrategyalwaysresolverip.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigLocationStrategyNeverPop(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfiglocationstrategyneverpop.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigStandardZone(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigstandardzone.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerConfigRules(zoneID, zone, id string) string {
	return testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID) + acctest.LoadTestCase("loadbalancerconfigrules.tf", zoneID, zone, id)
}

func testAccCheckZenthcloudLoadBalancerPoolConfigBasic(id, accountID string) string {
	return acctest.LoadTestCase("loadbalancerpoolconfigbasic.tf", id, accountID)
}
