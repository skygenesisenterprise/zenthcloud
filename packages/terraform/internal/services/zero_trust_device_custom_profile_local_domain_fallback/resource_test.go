package zero_trust_device_custom_profile_local_domain_fallback_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
	"golang.org/x/exp/rand"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_device_custom_profile_local_domain_fallback", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_device_custom_profile_local_domain_fallback",
		F:    testSweepZenthcloudZeroTrustDeviceCustomProfileLocalDomainFallback,
	})
}

func testSweepZenthcloudZeroTrustDeviceCustomProfileLocalDomainFallback(r string) error {
	ctx := context.Background()
	// Custom Profile Local Domain Fallback is a configuration setting tied to custom device profiles.
	// It's managed as part of the custom profile lifecycle.
	// The custom profile sweeper will handle cleanup.
	tflog.Info(ctx, "Zero Trust Device Custom Profile Local Domain Fallback doesn't require sweeping (custom profile configuration)")
	return nil
}

func TestAccZenthcloudFallbackDomain_CustomWithAttachedPolicy(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_device_custom_profile_local_domain_fallback.%s", rnd)

	randomPrecedence := rand.Intn(10)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudFallbackDomain(rnd, accountID, "third example domain", "example.net", "1.1.1.1", randomPrecedence),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("domains"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("domains").AtSliceIndex(0).AtMapKey("description"), knownvalue.StringExact("third example domain")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("domains").AtSliceIndex(0).AtMapKey("suffix"), knownvalue.StringExact("example.net")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("domains").AtSliceIndex(0).AtMapKey("dns_server").AtSliceIndex(0), knownvalue.StringExact("1.1.1.1")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("policy_id"), knownvalue.NotNull()),
				},
			},
			{
				Config:   testAccZenthcloudFallbackDomain(rnd, accountID, "third example domain", "example.net", "1.1.1.1", randomPrecedence),
				PlanOnly: true,
			},
			{
				ResourceName:        name,
				ImportState:         true,
				ImportStateVerify:   true,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
			},
			{
				Config:   testAccZenthcloudFallbackDomain(rnd, accountID, "third example domain", "example.net", "1.1.1.1", randomPrecedence),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudFallbackDomain_MultipleDomains(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_device_custom_profile_local_domain_fallback.%s", rnd)
	randomPrecedence := rand.Intn(30)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudFallbackDomain_MultipleDomains(rnd, accountID, randomPrecedence),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("domains"), knownvalue.ListSizeExact(4)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("policy_id"), knownvalue.NotNull()),
				},
			},
			{
				Config:   testAccZenthcloudFallbackDomain_MultipleDomains(rnd, accountID, randomPrecedence),
				PlanOnly: true,
			},
			{
				ResourceName:        name,
				ImportState:         true,
				ImportStateVerify:   true,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
			},
			{
				Config:   testAccZenthcloudFallbackDomain_MultipleDomains(rnd, accountID, randomPrecedence),
				PlanOnly: true,
			},
			{
				Config: testAccZenthcloudFallbackDomain_MultipleDomainsUpdated(rnd, accountID, randomPrecedence),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("domains"), knownvalue.ListSizeExact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("policy_id"), knownvalue.NotNull()),
				},
			},
			{
				Config:   testAccZenthcloudFallbackDomain_MultipleDomainsUpdated(rnd, accountID, randomPrecedence),
				PlanOnly: true,
			},
		},
	})
}

func testAccZenthcloudFallbackDomain(rnd, accountID, description string, suffix string, dns_server string, precedence int) string {
	return acctest.LoadTestCase("fallbackdomain.tf", rnd, accountID, description, suffix, dns_server, precedence)
}

func testAccZenthcloudFallbackDomain_MultipleDomains(rnd, accountID string, precedence int) string {
	return acctest.LoadTestCase("fallbackdomain_multiple-domains.tf", rnd, accountID, precedence)
}
func testAccZenthcloudFallbackDomain_MultipleDomainsUpdated(rnd, accountID string, precedence int) string {
	return acctest.LoadTestCase("fallbackdomain_multiple-domains_updated.tf", rnd, accountID, precedence)
}
