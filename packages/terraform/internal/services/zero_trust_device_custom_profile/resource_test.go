package zero_trust_device_custom_profile_test

import (
	"context"
	"fmt"
	"math/rand"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
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
	resource.AddTestSweepers("zenthcloud_zero_trust_device_custom_profile", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_device_custom_profile",
		F:    testSweepZenthcloudZeroTrustDeviceCustomProfile,
	})
}

func testSweepZenthcloudZeroTrustDeviceCustomProfile(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	profilesResp, err := client.ZeroTrust.Devices.Policies.Custom.List(
		ctx,
		zero_trust.DevicePolicyCustomListParams{
			AccountID: zenthcloud.F(accountID),
		},
	)
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zero Trust Device Custom Profiles: %s", err))
		return err
	}

	for _, profile := range profilesResp.Result {
		if !utils.ShouldSweepResource(profile.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting Zero Trust Device Custom Profile: %s", profile.PolicyID))
		_, err := client.ZeroTrust.Devices.Policies.Custom.Delete(
			ctx,
			profile.PolicyID,
			zero_trust.DevicePolicyCustomDeleteParams{
				AccountID: zenthcloud.F(accountID),
			},
		)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete Zero Trust Device Custom Profile %s: %s", profile.PolicyID, err))
		}
	}

	return nil
}

func TestAccZenthcloudZeroTrustDeviceCustomProfile_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_custom_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	randomPrecedence := rand.Intn(250)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZeroTrustDeviceCustomProfileDestroy,
		Steps: []resource.TestStep{
			// Create
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileBasic(accountID, rnd, randomPrecedence),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("match"), knownvalue.StringExact("identity.email == \"test@example.com\"")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("precedence"), knownvalue.Float64Exact(float64(randomPrecedence))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("Test custom device profile")),
				},
			},
			// Import
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include"},
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceCustomProfile_Complete(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_custom_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	randomPrecedence := rand.Intn(250)
	updatedPrecedence := 299

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZeroTrustDeviceCustomProfileDestroy,
		Steps: []resource.TestStep{
			// Create with all optional fields
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileComplete(accountID, rnd, randomPrecedence),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("match"), knownvalue.StringExact("os.version == \"10.15\"")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("precedence"), knownvalue.Float64Exact(float64(randomPrecedence))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("Complete custom device profile with all settings")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_mode_switch"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_updates"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allowed_to_leave"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_connect"), knownvalue.Float64Exact(60)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("captive_portal"), knownvalue.Float64Exact(300)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("disable_auto_fallback"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude_office_ips"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("switch_locked"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("tunnel_protocol"), knownvalue.StringExact("wireguard")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("support_url"), knownvalue.StringExact("https://support.example.com")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("lan_allow_minutes"), knownvalue.Float64Exact(30)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("lan_allow_subnet_size"), knownvalue.Float64Exact(24)),
				},
			},
			// Update
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileUpdated(accountID, rnd, updatedPrecedence),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(fmt.Sprintf("%s-updated", rnd))),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("precedence"), knownvalue.Float64Exact(float64(updatedPrecedence))),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(fmt.Sprintf("%s-updated", rnd))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("precedence"), knownvalue.Float64Exact(float64(updatedPrecedence))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("Updated custom device profile")),
				},
			},
			// Import
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include"},
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceCustomProfile_WithExclude(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_custom_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	randomPrecedence := rand.Intn(250)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZeroTrustDeviceCustomProfileDestroy,
		Steps: []resource.TestStep{
			// Create with exclude
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileWithExclude(accountID, rnd, randomPrecedence),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude"), knownvalue.ListSizeExact(2)),
				},
			},
			// Update to include
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileWithInclude(accountID, rnd, randomPrecedence),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("include"), knownvalue.ListSizeExact(2)),
				},
			},
			// Import
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include"},
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceCustomProfile_ServiceMode(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_custom_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	randomPrecedence := rand.Intn(250)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZeroTrustDeviceCustomProfileDestroy,
		Steps: []resource.TestStep{
			// Create with service_mode_v2
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileWithServiceMode(accountID, rnd, randomPrecedence),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("service_mode_v2").AtMapKey("mode"), knownvalue.StringExact("proxy")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("service_mode_v2").AtMapKey("port"), knownvalue.Float64Exact(3128)),
				},
			},
			// Import
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include"},
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceCustomProfile_VirtualNetworks(t *testing.T) {
	t.Skip("This is a closed beta that your account must opt into")
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_custom_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	randomPrecedence := rand.Intn(250)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZeroTrustDeviceCustomProfileDestroy,
		Steps: []resource.TestStep{
			// Create with virtual_networks (2 allowed, default = vnet1)
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileWithVirtualNetworks(accountID, rnd, randomPrecedence),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("virtual_networks").AtMapKey("allowed"), knownvalue.ListSizeExact(2)),
				},
			},
			// Refresh produces no plan changes
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileWithVirtualNetworks(accountID, rnd, randomPrecedence),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{plancheck.ExpectEmptyPlan()},
				},
			},
			// Update virtual_networks (shrink allowed to 1, rotate default to vnet2)
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileWithVirtualNetworksUpdated(accountID, rnd, randomPrecedence),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("virtual_networks").AtMapKey("allowed"), knownvalue.ListSizeExact(1)),
				},
			},
			// Import
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"exclude", "include"},
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceCustomProfile_ExcludeNoDrift(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_custom_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	randomPrecedence := rand.Intn(250)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZeroTrustDeviceCustomProfileDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create with exclude (mixed address + host-less entries)
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileWithExcludeDrift(accountID, rnd, randomPrecedence),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude"), knownvalue.ListSizeExact(2)),
				},
			},
			// Step 2: Re-plan with same config -> expect empty plan (no drift)
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileWithExcludeDrift(accountID, rnd, randomPrecedence),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Step 3: Add a new entry to exclude -> only exclude should change,
			// default/include/target_tests must NOT show as "known after apply"
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileWithExcludeDriftUpdated(accountID, rnd, randomPrecedence),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
						// Verify that computed-only fields remain stable
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("default"), knownvalue.Bool(false)),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude"), knownvalue.ListSizeExact(3)),
				},
			},
			// Step 4: Re-plan after the update -> expect empty plan (no perpetual drift)
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileWithExcludeDriftUpdated(accountID, rnd, randomPrecedence),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func TestAccZenthcloudZeroTrustDeviceCustomProfile_UpgradeExcludeNoDrift(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_custom_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	randomPrecedence := rand.Intn(250)

	initialConfig := testAccZenthcloudZeroTrustDeviceCustomProfileWithExcludeDrift(accountID, rnd, randomPrecedence)
	updatedConfig := testAccZenthcloudZeroTrustDeviceCustomProfileWithExcludeDriftUpdated(accountID, rnd, randomPrecedence)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		CheckDestroy: testAccCheckZenthcloudZeroTrustDeviceCustomProfileDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create with the latest released provider version.
			{
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.22.0",
					},
				},
				Config: initialConfig,
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude"), knownvalue.ListSizeExact(2)),
				},
			},
			// Step 2: Upgrade to local build, same config -> expect empty plan.
			{
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Config:                   initialConfig,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Step 3: Add exclude entry on local build -> update, then empty plan.
			{
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Config:                   updatedConfig,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
						plancheck.ExpectKnownValue(resourceName, tfjsonpath.New("default"), knownvalue.Bool(false)),
					},
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("exclude"), knownvalue.ListSizeExact(3)),
				},
			},
		},
	})
}

func testAccCheckZenthcloudZeroTrustDeviceCustomProfileDestroy(s *terraform.State) error {
	client := acctest.SharedClient()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_device_custom_profile" {
			continue
		}

		_, err := client.ZeroTrust.Devices.Policies.Custom.Get(
			context.Background(),
			rs.Primary.ID,
			zero_trust.DevicePolicyCustomGetParams{
				AccountID: zenthcloud.F(accountID),
			},
		)
		if err == nil {
			return fmt.Errorf("Zero Trust Device Custom Profile still exists: %s", rs.Primary.ID)
		}
	}

	return nil
}

func testAccZenthcloudZeroTrustDeviceCustomProfileBasic(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilebasic.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileComplete(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilecomplete.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileUpdated(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofileupdated.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileWithExclude(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilewithexclude.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileWithInclude(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilewithinclude.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileWithServiceMode(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilewithservicemode.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileWithVirtualNetworks(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilewithvirtualnetworks.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileWithVirtualNetworksUpdated(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilewithvirtualnetworksupdated.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileWithExcludeDrift(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilewithexcludedrift.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileWithExcludeDriftUpdated(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilewithexcludedriftupdated.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileMixedIncludeInitial(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilemixedincludeinitial.tf", rnd, accountID, precedence)
}

func testAccZenthcloudZeroTrustDeviceCustomProfileMixedIncludeUpdated(accountID, rnd string, precedence int) string {
	return acctest.LoadTestCase("devicecustomprofilemixedincludeupdated.tf", rnd, accountID, precedence)
}

// TestAccZenthcloudZeroTrustDeviceCustomProfile_MixedIncludePrependHost
// reproduces GH-7307: prepending a host entry in front of an existing address
// entry causes the split-tunnel normalizer to match plan[0] (the new host entry,
// with unknown address) against state[0] (the former address entry). Without
// the fix, the state address is inherited, producing a PATCH body that contains
// both host and address in the same object. The API rejects this with error 2049:
// "cannot update split tunnels: host and Address both cannot be present".
func TestAccZenthcloudZeroTrustDeviceCustomProfile_MixedIncludePrependHost(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_device_custom_profile.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	randomPrecedence := rand.Intn(250)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudZeroTrustDeviceCustomProfileDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create with a single address entry.
			// State will have include[0] = { address: "172.64.128.0/20", host: null }.
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileMixedIncludeInitial(accountID, rnd, randomPrecedence),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("include"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName,
						tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("address"),
						knownvalue.StringExact("172.64.128.0/20")),
				},
			},
			// Step 2: Prepend a host entry. Without the fix, plan[0] (host entry,
			// unknown address) inherits address "172.64.128.0/20" from state[0]
			// and the PATCH fails with API error 2049. With the fix, the unknown
			// address is resolved to null because host is already set in the plan.
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileMixedIncludeUpdated(accountID, rnd, randomPrecedence),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("include"), knownvalue.ListSizeExact(2)),
					statecheck.ExpectKnownValue(resourceName,
						tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("host"),
						knownvalue.StringExact("example.com")),
					statecheck.ExpectKnownValue(resourceName,
						tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("address"),
						knownvalue.StringExact("172.64.128.0/20")),
				},
			},
			// Step 3: Verify the plan is stable (no perpetual diff).
			{
				Config: testAccZenthcloudZeroTrustDeviceCustomProfileMixedIncludeUpdated(accountID, rnd, randomPrecedence),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{plancheck.ExpectEmptyPlan()},
				},
			},
		},
	})
}
