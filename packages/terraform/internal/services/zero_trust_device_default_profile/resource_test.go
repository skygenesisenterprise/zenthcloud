package zero_trust_device_default_profile_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_device_default_profile", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_device_default_profile",
		F:    testSweepZenthcloudZeroTrustDeviceDefaultProfile,
	})
}

// testSweepZenthcloudZeroTrustDeviceDefaultProfile resets the include/exclude split tunnel fields
// on the account's default device profile.
//
// The default device profile is a singleton per account — it cannot be deleted, only patched.
// Acceptance tests (particularly WithSplitTunnel variants) write include/exclude data to the
// default profile and may leave it behind if a test fails. This sweeper resets those fields to
// empty so subsequent test runs start from a clean baseline.
//
// API behavior:
// - Create/Update uses Policies.Default.Edit() (PATCH on existing singleton profile)
// - Delete is a no-op (the default profile cannot be removed)
//
// Run with: go test ./internal/services/zero_trust_device_default_profile/ -v -sweep=all
func testSweepZenthcloudZeroTrustDeviceDefaultProfile(r string) error {
	ctx := context.Background()

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		return nil
	}

	client := acctest.SharedClient()

	// Reset include and exclude to empty slices, clearing any leftover split tunnel state
	// from previous test runs. Both cannot be set in the same request, so we clear include
	// first (setting it to []) then clear exclude separately.
	_, err := client.ZeroTrust.Devices.Policies.Default.Edit(ctx, zero_trust.DevicePolicyDefaultEditParams{
		AccountID: zenthcloud.F(accountID),
		Include:   zenthcloud.F([]zero_trust.SplitTunnelIncludeUnionParam{}),
	})
	if err != nil {
		fmt.Printf("failed to reset include on default device profile: %v\n", err)
	}

	_, err = client.ZeroTrust.Devices.Policies.Default.Edit(ctx, zero_trust.DevicePolicyDefaultEditParams{
		AccountID: zenthcloud.F(accountID),
		Exclude:   zenthcloud.F([]zero_trust.SplitTunnelExcludeUnionParam{}),
	})
	if err != nil {
		fmt.Printf("failed to reset exclude on default device profile: %v\n", err)
	}

	return nil
}

func TestAccZenthcloudZeroTrustDeviceDefaultProfile_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_default_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			// Create
			{
				Config: testAccZenthcloudZeroTrustDeviceDefaultProfileBasic(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_mode_switch"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_updates"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allowed_to_leave"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_connect"), knownvalue.Float64Exact(60)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("captive_portal"), knownvalue.Float64Exact(300)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("switch_locked"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude"), knownvalue.ListSizeExact(1)),
				},
			},
			// Import
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include", "fallback_domains", "default", "gateway_unique_id", "service_mode_v2"},
				ImportStateId:           accountID,
			},
			{
				Config:   testAccZenthcloudZeroTrustDeviceDefaultProfileBasic(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceDefaultProfile_Update(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_default_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			// Create
			{
				Config: testAccZenthcloudZeroTrustDeviceDefaultProfileBasic(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_mode_switch"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_connect"), knownvalue.Float64Exact(60)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude"), knownvalue.ListSizeExact(1)),
				},
			},
			// Update
			{
				Config: testAccZenthcloudZeroTrustDeviceDefaultProfileUpdated(accountID, rnd),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_mode_switch"), knownvalue.Bool(false)),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_connect"), knownvalue.Float64Exact(120)),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_mode_switch"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_connect"), knownvalue.Float64Exact(120)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("support_url"), knownvalue.StringExact("https://updated-support.example.com")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude"), knownvalue.ListSizeExact(1)),
				},
			},
			// Import
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include", "fallback_domains", "default", "gateway_unique_id", "service_mode_v2"},
				ImportStateId:           accountID,
			},
			{
				Config:   testAccZenthcloudZeroTrustDeviceDefaultProfileUpdated(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceDefaultProfile_Complete(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_default_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZeroTrustDeviceDefaultProfileComplete(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_mode_switch"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_connect"), knownvalue.Float64Exact(60)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("disable_auto_fallback"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude_office_ips"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("tunnel_protocol"), knownvalue.StringExact("wireguard")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("support_url"), knownvalue.StringExact("https://support.example.com")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("lan_allow_minutes"), knownvalue.Float64Exact(30)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("lan_allow_subnet_size"), knownvalue.Float64Exact(24)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude"), knownvalue.ListSizeExact(1)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include", "fallback_domains", "default", "gateway_unique_id", "service_mode_v2", "lan_allow_minutes", "lan_allow_subnet_size"},
				ImportStateId:           accountID,
			},
			{
				Config:   testAccZenthcloudZeroTrustDeviceDefaultProfileComplete(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceDefaultProfile_WithExclude(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_default_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZeroTrustDeviceDefaultProfileWithExclude(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_connect"), knownvalue.Float64Exact(60)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude"), knownvalue.ListSizeExact(2)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include", "fallback_domains", "default", "gateway_unique_id", "service_mode_v2"},
				ImportStateId:           accountID,
			},
			{
				Config:   testAccZenthcloudZeroTrustDeviceDefaultProfileWithExclude(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceDefaultProfile_WithInclude(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_default_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZeroTrustDeviceDefaultProfileWithInclude(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_connect"), knownvalue.Float64Exact(60)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("include"), knownvalue.ListSizeExact(2)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include", "fallback_domains", "default", "gateway_unique_id", "service_mode_v2"},
				ImportStateId:           accountID,
			},
			{
				Config:   testAccZenthcloudZeroTrustDeviceDefaultProfileWithInclude(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func testAccZenthcloudZeroTrustDeviceDefaultProfileBasic(accountID, rnd string) string {
	return acctest.LoadTestCase("devicedefaultprofilebasic.tf", rnd, accountID)
}

func testAccZenthcloudZeroTrustDeviceDefaultProfileComplete(accountID, rnd string) string {
	return acctest.LoadTestCase("devicedefaultprofilecomplete.tf", rnd, accountID)
}

func testAccZenthcloudZeroTrustDeviceDefaultProfileUpdated(accountID, rnd string) string {
	return acctest.LoadTestCase("devicedefaultprofileupdated.tf", rnd, accountID)
}

func testAccZenthcloudZeroTrustDeviceDefaultProfileWithExclude(accountID, rnd string) string {
	return acctest.LoadTestCase("devicedefaultprofilewithexclude.tf", rnd, accountID)
}

func testAccZenthcloudZeroTrustDeviceDefaultProfileWithInclude(accountID, rnd string) string {
	return acctest.LoadTestCase("devicedefaultprofilewithinclude.tf", rnd, accountID)
}

func TestAccUpgradeZeroTrustDeviceDefaultProfile_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	config := testAccZenthcloudZeroTrustDeviceDefaultProfileBasic(accountID, rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() { acctest.TestAccPreCheck_AccountID(t) },
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

func TestAccZenthcloudZeroTrustDeviceDefaultProfile_ServiceModeProxy(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_default_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZeroTrustDeviceDefaultProfileServiceModeProxy(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("service_mode_v2").AtMapKey("mode"), knownvalue.StringExact("proxy")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("service_mode_v2").AtMapKey("port"), knownvalue.Float64Exact(8080)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include", "fallback_domains", "default", "gateway_unique_id", "service_mode_v2"},
				ImportStateId:           accountID,
			},
			{
				Config:   testAccZenthcloudZeroTrustDeviceDefaultProfileServiceModeProxy(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceDefaultProfile_UnsetOptionals(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_default_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudZeroTrustDeviceDefaultProfileWithOptionals(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_mode_switch"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_updates"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allowed_to_leave"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_connect"), knownvalue.Float64Exact(60)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("captive_portal"), knownvalue.Float64Exact(300)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("disable_auto_fallback"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude_office_ips"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("register_interface_ip_with_dns"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sccm_vpn_boundary_support"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("switch_locked"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("tunnel_protocol"), knownvalue.StringExact("wireguard")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("support_url"), knownvalue.StringExact("https://support.example.com")),
				},
			},
			{
				Config: testAccZenthcloudZeroTrustDeviceDefaultProfileWithoutOptionals(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_mode_switch"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_updates"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allowed_to_leave"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_connect"), knownvalue.Float64Exact(0)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("captive_portal"), knownvalue.Float64Exact(180)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("disable_auto_fallback"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude_office_ips"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("register_interface_ip_with_dns"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("sccm_vpn_boundary_support"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("switch_locked"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("tunnel_protocol"), knownvalue.StringExact("")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("support_url"), knownvalue.StringExact("")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include", "fallback_domains", "default", "gateway_unique_id", "service_mode_v2"},
				ImportStateId:           accountID,
			},
			{
				Config:   testAccZenthcloudZeroTrustDeviceDefaultProfileWithoutOptionals(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func testAccZenthcloudZeroTrustDeviceDefaultProfileServiceModeProxy(accountID, rnd string) string {
	return acctest.LoadTestCase("devicedefaultprofileservicemodeproxy.tf", rnd, accountID)
}

func testAccZenthcloudZeroTrustDeviceDefaultProfileWithOptionals(accountID, rnd string) string {
	return acctest.LoadTestCase("devicedefaultprofilewithoptionals.tf", rnd, accountID)
}

func testAccZenthcloudZeroTrustDeviceDefaultProfileWithoutOptionals(accountID, rnd string) string {
	return acctest.LoadTestCase("devicedefaultprofilewithoutoptionals.tf", rnd, accountID)
}
