package zero_trust_access_application_test

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/zenthcloud/zenthcloud-go"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
	"github.com/pkg/errors"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_access_application", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_access_application",
		F:    testSweepZenthcloudAccessApplications,
	})
}

func testSweepZenthcloudAccessApplications(r string) error {
	ctx := context.Background()

	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	// Zone level Access Applications.
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping zone-level Access Applications sweep: ZENTHCLOUD_ZONE_ID not set")
		zoneID = "skip" // Use placeholder to skip zone sweep
	}
	zoneAccessApps, _, err := client.ListAccessApplications(context.Background(), zenthcloud.ZoneIdentifier(zoneID), zenthcloud.ListAccessApplicationsParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch zone level Access Applications: %s", err))
	}

	if len(zoneAccessApps) == 0 {
		tflog.Info(ctx, "No Zenthcloud zone level Access Applications to sweep")
	}

	for _, accessApp := range zoneAccessApps {
		tflog.Info(ctx, fmt.Sprintf("Deleting zone-level Access Application: %s (%s)", accessApp.Name, accessApp.ID))
		if err := client.DeleteAccessApplication(context.Background(), zenthcloud.ZoneIdentifier(zoneID), accessApp.ID); err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete zone-level Access Application %s (%s): %s", accessApp.Name, accessApp.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted zone-level Access Application: %s (%s)", accessApp.Name, accessApp.ID))
	}

	// Account level Access Applications.
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping account-level Access Applications sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}
	accountAccessApps, _, err := client.ListAccessApplications(context.Background(), zenthcloud.AccountIdentifier(accountID), zenthcloud.ListAccessApplicationsParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch account level Access Applications: %s", err))
	}

	if len(accountAccessApps) == 0 {
		tflog.Info(ctx, "No Zenthcloud account level Access Applications to sweep")
		return nil
	}

	for _, accessApp := range accountAccessApps {
		tflog.Info(ctx, fmt.Sprintf("Deleting account-level Access Application: %s (%s)", accessApp.Name, accessApp.ID))
		if err := client.DeleteAccessApplication(context.Background(), zenthcloud.AccountIdentifier(accountID), accessApp.ID); err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete account-level Access Application %s (%s): %s", accessApp.Name, accessApp.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted account-level Access Application: %s (%s)", accessApp.Name, accessApp.ID))
	}

	return nil
}

var (
	zoneID    = os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain    = os.Getenv("ZENTHCLOUD_DOMAIN")
	accountID = os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
)

func TestAccZenthcloudAccessApplication_BasicZone(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigBasic(rnd, domain, zenthcloud.ZoneIdentifier(zoneID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("domain"), knownvalue.StringExact(fmt.Sprintf("%s.%s", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("session_duration"), knownvalue.StringExact("24h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("cors_headers"), knownvalue.Null()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_redirect_to_identity"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("service_auth_401_redirect"), knownvalue.Bool(false)),

					// destinations and self_hosted_domains should be populated from the API
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("destinations"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("destinations").AtSliceIndex(0).AtMapKey("type"), knownvalue.StringExact("public")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("destinations").AtSliceIndex(0).AtMapKey("uri"), knownvalue.StringExact(fmt.Sprintf("%s.%s", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("self_hosted_domains"), knownvalue.ListSizeExact(1)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains"},
			},
			{
				// Ensures no diff on second plan
				Config:   testAccZenthcloudAccessApplicationConfigBasic(rnd, domain, zenthcloud.ZoneIdentifier(zoneID)),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_BasicAccount(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigBasic(rnd, domain, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("domain"), knownvalue.StringExact(fmt.Sprintf("%s.%s", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("session_duration"), knownvalue.StringExact("24h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("cors_headers"), knownvalue.Null()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_redirect_to_identity"), knownvalue.Bool(false)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains"},
			},
			{
				// Ensures no diff on second plan
				Config:   testAccZenthcloudAccessApplicationConfigBasic(rnd, domain, zenthcloud.AccountIdentifier(accountID)),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSCIMConfigHttpBasic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationSCIMConfigValidHttpBasic(rnd, accountID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("domain"), knownvalue.StringExact(fmt.Sprintf("%s.%s", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("session_duration"), knownvalue.StringExact("24h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("remote_uri"), knownvalue.StringExact("scim.com")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("deactivate_on_delete"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("scheme"), knownvalue.StringExact("httpbasic")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("user"), knownvalue.StringExact("test")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("password"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("schema"), knownvalue.StringExact("urn:ietf:params:scim:schemas:core:2.0:User")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("filter"), knownvalue.StringExact("title pr or userType eq \"Intern\"")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("transform_jsonata"), knownvalue.StringExact("$merge([$, {'userName': $substringBefore($.userName, '@') & '+test@' & $substringAfter($.userName, '@')}])")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("create"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("update"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("delete"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains", "scim_config.authentication.password", "auto_redirect_to_identity"},
			},
			{
				// Ensures no diff on second plan
				Config:   testAccZenthcloudAccessApplicationSCIMConfigValidHttpBasic(rnd, accountID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_UpdateSCIMConfig(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationSCIMConfigValidHttpBasic(rnd, accountID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("domain"), knownvalue.StringExact(fmt.Sprintf("%s.%s", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("session_duration"), knownvalue.StringExact("24h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("remote_uri"), knownvalue.StringExact("scim.com")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("deactivate_on_delete"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("scheme"), knownvalue.StringExact("httpbasic")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("user"), knownvalue.StringExact("test")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("password"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("schema"), knownvalue.StringExact("urn:ietf:params:scim:schemas:core:2.0:User")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("filter"), knownvalue.StringExact("title pr or userType eq \"Intern\"")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("transform_jsonata"), knownvalue.StringExact("$merge([$, {'userName': $substringBefore($.userName, '@') & '+test@' & $substringAfter($.userName, '@')}])")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("create"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("update"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("delete"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains", "scim_config.authentication.password", "auto_redirect_to_identity"},
			},
			{
				// Ensures no diff on second plan
				Config:   testAccZenthcloudAccessApplicationSCIMConfigValidHttpBasic(rnd, accountID, domain),
				PlanOnly: true,
			},
			{
				Config: testAccZenthcloudAccessApplicationSCIMConfigValidOAuthBearerTokenNoMappings(rnd, accountID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("domain"), knownvalue.StringExact(fmt.Sprintf("%s.%s", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("session_duration"), knownvalue.StringExact("24h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("enabled"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("remote_uri"), knownvalue.StringExact("scim2.com")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("deactivate_on_delete"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("scheme"), knownvalue.StringExact("oauthbearertoken")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("token"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings"), knownvalue.Null()),
				},
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationSCIMConfigValidOAuthBearerTokenNoMappings(rnd, accountID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSCIMConfigInvalidMappingSchema(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccZenthcloudAccessApplicationSCIMConfigInvalidMappingSchema(rnd, accountID, domain),
				ExpectError: regexp.MustCompile(`.*invalid SCIM schema in mappings.*`),
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSCIMConfigHttpBasicMissingRequired(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccZenthcloudAccessApplicationSCIMConfigHttpBasicMissingRequired(rnd, accountID, domain),
				ExpectError: regexp.MustCompile(`.*password is a required field.*`),
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSCIMConfigOAuthBearerToken(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationSCIMConfigValidOAuthBearerToken(rnd, accountID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("domain"), knownvalue.StringExact(fmt.Sprintf("%s.%s", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("session_duration"), knownvalue.StringExact("24h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("remote_uri"), knownvalue.StringExact("scim.com")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("deactivate_on_delete"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("scheme"), knownvalue.StringExact("oauthbearertoken")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("token"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("schema"), knownvalue.StringExact("urn:ietf:params:scim:schemas:core:2.0:User")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("filter"), knownvalue.StringExact("title pr or userType eq \"Intern\"")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("transform_jsonata"), knownvalue.StringExact("$merge([$, {'userName': $substringBefore($.userName, '@') & '+test@' & $substringAfter($.userName, '@')}])")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("create"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("update"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("delete"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains", "scim_config.authentication.token", "auto_redirect_to_identity"},
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationSCIMConfigValidOAuthBearerToken(rnd, accountID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSCIMConfigOAuth2(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationSCIMConfigValidOAuth2(rnd, accountID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("domain"), knownvalue.StringExact(fmt.Sprintf("%s.%s", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("session_duration"), knownvalue.StringExact("24h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("remote_uri"), knownvalue.StringExact("scim.com")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("deactivate_on_delete"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("scheme"), knownvalue.StringExact("oauth2")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("client_id"), knownvalue.StringExact("beepboop")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("authorization_url"), knownvalue.StringExact("https://www.authorization.com")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("scopes"), knownvalue.SetSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("authentication").AtMapKey("token_url"), knownvalue.StringExact("https://www.token.com")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("schema"), knownvalue.StringExact("urn:ietf:params:scim:schemas:core:2.0:User")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("filter"), knownvalue.StringExact("title pr or userType eq \"Intern\"")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("transform_jsonata"), knownvalue.StringExact("$merge([$, {'userName': $substringBefore($.userName, '@') & '+test@' & $substringAfter($.userName, '@')}])")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("create"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("update"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("scim_config").AtMapKey("mappings").AtSliceIndex(0).AtMapKey("operations").AtMapKey("delete"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains", "scim_config.authentication.client_secret", "auto_redirect_to_identity"},
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationSCIMConfigValidOAuth2(rnd, accountID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSCIMConfigOAuth2MissingRequired(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccZenthcloudAccessApplicationSCIMConfigOAuth2MissingRequired(rnd, accountID, domain),
				ExpectError: regexp.MustCompile(`.*token_url is a required field.*`),
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithCORS(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithCORS(rnd, zoneID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("domain"), knownvalue.StringExact(fmt.Sprintf("%s.%s", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("session_duration"), knownvalue.StringExact("24h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("cors_headers").AtMapKey("allowed_methods"), knownvalue.ListSizeExact(3)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("cors_headers").AtMapKey("allowed_origins"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("cors_headers").AtMapKey("max_age"), knownvalue.Int64Exact(10)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("auto_redirect_to_identity"), knownvalue.Bool(false)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
				ImportStateVerifyIgnore: []string{"destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains"},
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithCORS(rnd, zoneID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSAMLSaas(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithSAMLSaas(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("saas")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("session_duration"), knownvalue.StringExact("24h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("sp_entity_id"), knownvalue.StringExact("saas-app.example")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("consumer_service_url"), knownvalue.StringExact("https://saas-app.example/sso/saml/consume")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("name_id_format"), knownvalue.StringExact("email")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("default_relay_state"), knownvalue.StringExact("https://saas-app.example")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("name_id_transform_jsonata"), knownvalue.StringExact("$substringBefore(email, '@') & '+sandbox@' & $substringAfter(email, '@')")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("saml_attribute_transform_jsonata"), knownvalue.StringExact("$ ~>| groups | {'group_name': name} |")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("idp_entity_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("public_key"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("sso_endpoint"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes"), knownvalue.ListSizeExact(2)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(0).AtMapKey("name"), knownvalue.StringExact("email")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(0).AtMapKey("name_format"), knownvalue.StringExact("urn:oasis:names:tc:SAML:2.0:attrname-format:basic")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(0).AtMapKey("source").AtMapKey("name"), knownvalue.StringExact("user_email")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(1).AtMapKey("name"), knownvalue.StringExact("rank")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(1).AtMapKey("source").AtMapKey("name"), knownvalue.StringExact("rank")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(1).AtMapKey("friendly_name"), knownvalue.StringExact("Rank")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(1).AtMapKey("required"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains"},
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithSAMLSaas(rnd, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSAMLSaas_Import(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_zero_trust_access_application." + rnd
	resourceName := name

	stateChecks := []statecheck.StateCheck{
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("saas")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("session_duration"), knownvalue.StringExact("24h")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("sp_entity_id"), knownvalue.StringExact("saas-app.example")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("consumer_service_url"), knownvalue.StringExact("https://saas-app.example/sso/saml/consume")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("name_id_format"), knownvalue.StringExact("email")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("default_relay_state"), knownvalue.StringExact("https://saas-app.example")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("name_id_transform_jsonata"), knownvalue.StringExact("$substringBefore(email, '@') & '+sandbox@' & $substringAfter(email, '@')")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("saml_attribute_transform_jsonata"), knownvalue.StringExact("$ ~>| groups | {'group_name': name} |")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes"), knownvalue.ListSizeExact(2)),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(0).AtMapKey("name"), knownvalue.StringExact("email")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(0).AtMapKey("name_format"), knownvalue.StringExact("urn:oasis:names:tc:SAML:2.0:attrname-format:basic")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(0).AtMapKey("source").AtMapKey("name"), knownvalue.StringExact("user_email")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(1).AtMapKey("name"), knownvalue.StringExact("rank")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(1).AtMapKey("source").AtMapKey("name"), knownvalue.StringExact("rank")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(1).AtMapKey("friendly_name"), knownvalue.StringExact("Rank")),
		statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("saas_app").AtMapKey("custom_attributes").AtSliceIndex(1).AtMapKey("required"), knownvalue.Bool(true)),
	}

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:            testAccZenthcloudAccessApplicationConfigWithSAMLSaas(rnd, accountID),
				ConfigStateChecks: stateChecks,
			},
			{
				ImportState:         true,
				ImportStateVerify:   true,
				ResourceName:        resourceName,
				ImportStateIdPrefix: fmt.Sprintf("accounts/%s/", accountID),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithSAMLSaas(rnd, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithOIDCSaas(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithOIDCSaas(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "type", "saas"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "saas_app.auth_type", "oidc"),
					resource.TestCheckResourceAttr(name, "saas_app.redirect_uris.#", "1"),
					resource.TestCheckResourceAttr(name, "saas_app.redirect_uris.0", "https://saas-app.example/sso/oauth2/callback"),
					resource.TestCheckResourceAttr(name, "saas_app.grant_types.#", "2"),
					resource.TestCheckResourceAttr(name, "saas_app.grant_types.0", "authorization_code"),
					resource.TestCheckResourceAttr(name, "saas_app.grant_types.1", "hybrid"),
					resource.TestCheckResourceAttr(name, "saas_app.scopes.0", "openid"),
					resource.TestCheckResourceAttr(name, "saas_app.scopes.1", "email"),
					resource.TestCheckResourceAttr(name, "saas_app.scopes.2", "profile"),
					resource.TestCheckResourceAttr(name, "saas_app.scopes.3", "groups"),
					resource.TestCheckResourceAttr(name, "saas_app.app_launcher_url", "https://saas-app.example/sso/login"),
					resource.TestCheckResourceAttr(name, "saas_app.group_filter_regex", ".*"),
					resource.TestCheckResourceAttr(name, "saas_app.allow_pkce_without_client_secret", "false"),
					resource.TestCheckResourceAttr(name, "saas_app.refresh_token_options.lifetime", "1h"),
					resource.TestCheckResourceAttr(name, "saas_app.custom_claims.#", "1"),
					resource.TestCheckResourceAttr(name, "saas_app.custom_claims.0.name", "rank"),
					resource.TestCheckResourceAttr(name, "saas_app.custom_claims.0.scope", "profile"),
					resource.TestCheckResourceAttr(name, "saas_app.custom_claims.0.required", "true"),
					resource.TestCheckResourceAttr(name, "saas_app.custom_claims.0.source.name", "rank"),
					resource.TestCheckResourceAttr(name, "saas_app.hybrid_and_implicit_options.return_access_token_from_authorization_endpoint", "true"),
					resource.TestCheckResourceAttr(name, "saas_app.hybrid_and_implicit_options.return_id_token_from_authorization_endpoint", "true"),
					resource.TestCheckResourceAttrSet(name, "saas_app.client_secret"),
					resource.TestCheckResourceAttrSet(name, "saas_app.public_key"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithOIDCSaas(rnd, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithOIDCSaas_Import(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_zero_trust_access_application." + rnd

	checkFn := resource.ComposeTestCheckFunc(
		resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
		resource.TestCheckResourceAttr(name, "name", rnd),
		resource.TestCheckResourceAttr(name, "type", "saas"),
		resource.TestCheckResourceAttr(name, "session_duration", "24h"),
		resource.TestCheckResourceAttr(name, "saas_app.auth_type", "oidc"),
		resource.TestCheckResourceAttr(name, "saas_app.redirect_uris.#", "1"),
		resource.TestCheckResourceAttr(name, "saas_app.redirect_uris.0", "https://saas-app.example/sso/oauth2/callback"),
		resource.TestCheckResourceAttr(name, "saas_app.grant_types.#", "2"),
		resource.TestCheckResourceAttr(name, "saas_app.grant_types.0", "authorization_code"),
		resource.TestCheckResourceAttr(name, "saas_app.grant_types.1", "hybrid"),
		resource.TestCheckResourceAttr(name, "saas_app.scopes.0", "openid"),
		resource.TestCheckResourceAttr(name, "saas_app.scopes.1", "email"),
		resource.TestCheckResourceAttr(name, "saas_app.scopes.2", "profile"),
		resource.TestCheckResourceAttr(name, "saas_app.scopes.3", "groups"),
		resource.TestCheckResourceAttr(name, "saas_app.app_launcher_url", "https://saas-app.example/sso/login"),
		resource.TestCheckResourceAttr(name, "saas_app.group_filter_regex", ".*"),
		resource.TestCheckResourceAttr(name, "saas_app.allow_pkce_without_client_secret", "false"),
		resource.TestCheckResourceAttr(name, "saas_app.refresh_token_options.lifetime", "1h"),
		resource.TestCheckResourceAttr(name, "saas_app.custom_claims.#", "1"),
		resource.TestCheckResourceAttr(name, "saas_app.custom_claims.0.name", "rank"),
		resource.TestCheckResourceAttr(name, "saas_app.custom_claims.0.scope", "profile"),
		resource.TestCheckResourceAttr(name, "saas_app.custom_claims.0.required", "true"),
		resource.TestCheckResourceAttr(name, "saas_app.custom_claims.0.source.name", "rank"),
		resource.TestCheckResourceAttr(name, "saas_app.hybrid_and_implicit_options.return_access_token_from_authorization_endpoint", "true"),
		resource.TestCheckResourceAttr(name, "saas_app.hybrid_and_implicit_options.return_id_token_from_authorization_endpoint", "true"),
	)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithOIDCSaas(rnd, accountID),
				Check:  checkFn,
			},
			{
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"saas_app.client_secret", "saas_app.allow_pkce_without_client_secret"},
				ResourceName:            name,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				Check:                   checkFn,
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithOIDCSaas(rnd, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithAutoRedirectToIdentity(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithAutoRedirectToIdentity(rnd, zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "auto_redirect_to_identity", "true"),
					resource.TestCheckResourceAttr(name, "allowed_idps.#", "1"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithAutoRedirectToIdentity(rnd, zoneID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithEnableBindingCookie(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithEnableBindingCookie(rnd, zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "enable_binding_cookie", "true"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithEnableBindingCookie(rnd, zoneID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithCustomDenyFields(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithCustomDenyFields(rnd, zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "custom_deny_message", "denied!"),
					resource.TestCheckResourceAttr(name, "custom_deny_url", "https://github.com/skygenesisenterprise/zenthcloud"),
					resource.TestCheckResourceAttr(name, "custom_non_identity_deny_url", "https://www.blocked.com"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithCustomDenyFields(rnd, zoneID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithADefinedIdp(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithADefinedIdp(rnd, zoneID, domain, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "auto_redirect_to_identity", "true"),
					resource.TestCheckResourceAttr(name, "allowed_idps.#", "1"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithADefinedIdp(rnd, zoneID, domain, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithMultipleIdpsReordered(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	idp1 := utils.GenerateRandomResourceName()
	idp2 := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithMultipleIdps(rnd, zoneID, domain, accountID, idp1, idp2),
			},
			{
				Config: testAccZenthcloudAccessApplicationConfigWithMultipleIdps(rnd, zoneID, domain, accountID, idp2, idp1),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithMultipleIdps(rnd, zoneID, domain, accountID, idp2, idp1),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithHttpOnlyCookieAttribute(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithHTTPOnlyCookieAttribute(rnd, zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "http_only_cookie_attribute", "true"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithHTTPOnlyCookieAttribute(rnd, zoneID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithHTTPOnlyCookieAttributeSetToFalse(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithHTTPOnlyCookieAttributeSetToFalse(rnd, zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "http_only_cookie_attribute", "false"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithHTTPOnlyCookieAttributeSetToFalse(rnd, zoneID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSameSiteCookieAttribute(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigSameSiteCookieAttribute(rnd, zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "same_site_cookie_attribute", "strict"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigSameSiteCookieAttribute(rnd, zoneID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithLogoURL(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigLogoURL(rnd, zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "logo_url", "https://github.com/skygenesisenterprise/zenthcloud"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigLogoURL(rnd, zoneID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSkipInterstitial(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigSkipInterstitial(rnd, zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "skip_interstitial", "true"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigSkipInterstitial(rnd, zoneID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithAppLauncherVisible(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithAppLauncherVisible(rnd, zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "app_launcher_visible", "true"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithAppLauncherVisible(rnd, zoneID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithSelfHostedDomains(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationWithSelfHostedDomains(rnd, domain, zenthcloud.AccountIdentifier(accountID)),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "self_hosted_domains.#", "2"),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "cors_headers.#", "0"),
					resource.TestCheckResourceAttr(name, "sass_app.#", "0"),
					resource.TestCheckResourceAttr(name, "auto_redirect_to_identity", "false"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationWithSelfHostedDomains(rnd, domain, zenthcloud.AccountIdentifier(accountID)),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithDefinedTags(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithADefinedTag(rnd, zoneID, domain, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "tags.#", "1"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithADefinedTag(rnd, zoneID, domain, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithLegacyPolicies(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithLegacyPolicies(rnd, domain, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "policies.#", "3"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithLegacyPolicies(rnd, domain, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithReusablePolicies(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithReusablePolicies(rnd, domain, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "domain", fmt.Sprintf("%s.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "type", "self_hosted"),
					resource.TestCheckResourceAttr(name, "policies.#", "2"),
				),
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains", "tags", "auto_redirect_to_identity"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateCheck: func(s []*terraform.InstanceState) error {
					if len(s) != 1 {
						return fmt.Errorf("expected 1 state, got %d", len(s))
					}

					policiesCount := s[0].Attributes["policies.#"]
					if policiesCount != "2" {
						return fmt.Errorf("expected 2 policies, got %s", policiesCount)
					}

					if s[0].Attributes["policies.0.id"] == "" {
						return fmt.Errorf("expected policy ID to be preserved")
					}
					if s[0].Attributes["policies.1.id"] == "" {
						return fmt.Errorf("expected policy ID to be preserved")
					}

					if _, ok := s[0].Attributes["policies.0.name"]; ok {
						return fmt.Errorf("expected policy name to be nullified")
					}
					if _, ok := s[0].Attributes["policies.0.decision"]; ok {
						return fmt.Errorf("expected policy decision to be nullified")
					}
					if _, ok := s[0].Attributes["policies.0.include.#"]; ok {
						return fmt.Errorf("expected policy include to be nullified")
					}

					if _, ok := s[0].Attributes["skip_interstitial"]; ok {
						return fmt.Errorf("expected skip_interstitial to be nullified")
					}
					if _, ok := s[0].Attributes["allow_iframe"]; ok {
						return fmt.Errorf("expected allow_iframe to be nullified")
					}
					if _, ok := s[0].Attributes["path_cookie_attribute"]; ok {
						return fmt.Errorf("expected path_cookie_attribute to be nullified")
					}

					return nil
				},
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationConfigWithReusablePolicies(rnd, domain, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithReusablePolicies_InvalidPrecedence(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccZenthcloudAccessApplicationConfigWithReusablePoliciesInvalidPrecedence(rnd, domain, accountID),
				ExpectError: regexp.MustCompile(`Attribute policies\[0].precedence value must be at least 1, got: 0`),
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithAppLauncherCustomization(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccessApplicationWithAppLauncherCustomizationFields(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "type", "app_launcher"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "header_bg_color", "#000000"),
					resource.TestCheckResourceAttr(name, "bg_color", "#000000"),
					resource.TestCheckResourceAttr(name, "app_launcher_logo_url", "https://github.com/skygenesisenterprise/zenthcloud"),
					resource.TestCheckResourceAttr(name, "landing_page_design.title", "title"),
					resource.TestCheckResourceAttr(name, "landing_page_design.message", "message"),
					resource.TestCheckResourceAttr(name, "landing_page_design.button_color", "#000000"),
					resource.TestCheckResourceAttr(name, "landing_page_design.button_text_color", "#000000"),
					resource.TestCheckResourceAttr(name, "landing_page_design.image_url", "https://github.com/skygenesisenterprise/zenthcloud"),
					resource.TestCheckResourceAttr(name, "footer_links.0.name", "footer link"),
					resource.TestCheckResourceAttr(name, "footer_links.0.url", "https://github.com/skygenesisenterprise/zenthcloud"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccessApplicationWithAppLauncherCustomizationFields(rnd, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_Infrastructure(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationInfrastructure(rnd, accountID, ""),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "type", "infrastructure"),
					resource.TestCheckResourceAttr(name, "target_criteria.#", "1"),
					resource.TestCheckResourceAttr(name, "target_criteria.0.port", "22"),
					resource.TestCheckResourceAttr(name, "target_criteria.0.protocol", "SSH"),
					resource.TestCheckResourceAttr(name, "target_criteria.0.target_attributes.hostname.#", "1"),
					resource.TestCheckResourceAttr(name, "target_criteria.0.target_attributes.hostname.0", rnd),
					resource.TestCheckResourceAttr(name, "policies.#", "1"),
					resource.TestCheckResourceAttr(name, "policies.0.connection_rules.ssh.usernames.#", "1"),
					resource.TestCheckResourceAttr(name, "policies.0.connection_rules.ssh.usernames.0", "root"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationInfrastructure(rnd, accountID, ""),
				PlanOnly: true,
			},
			{
				Config: testAccZenthcloudAccessApplicationInfrastructure(rnd, accountID, "8h"),
				Check:  resource.TestCheckResourceAttr(name, "session_duration", "8h"),
			},
			{
				Config:   testAccZenthcloudAccessApplicationInfrastructure(rnd, accountID, "8h"),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_RDP(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	appDomain := fmt.Sprintf("%[1]s.%[2]s", rnd, domain)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationRDP(rnd, accountID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "type", "rdp"),
					resource.TestCheckResourceAttr(name, "domain", appDomain),
					resource.TestCheckResourceAttr(name, "destinations.#", "1"),
					resource.TestCheckResourceAttr(name, "destinations.0.uri", appDomain),
					resource.TestCheckResourceAttr(name, "target_criteria.#", "1"),
					resource.TestCheckResourceAttr(name, "target_criteria.0.port", "3389"),
					resource.TestCheckResourceAttr(name, "target_criteria.0.protocol", "RDP"),
					resource.TestCheckResourceAttr(name, "target_criteria.0.target_attributes.hostname.#", "1"),
					resource.TestCheckResourceAttr(name, "target_criteria.0.target_attributes.hostname.0", rnd),
					resource.TestCheckResourceAttr(name, "policies.#", "1"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccZenthcloudAccessApplicationRDP(rnd, accountID, domain),
				PlanOnly: true,
			},
		},
	})
}

func testAccZenthcloudAccessApplicationConfigBasic(rnd string, domain string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("accessapplicationconfigbasic.tf", rnd, domain, identifier.Type, identifier.Identifier)
}

func testAccZenthcloudAccessApplicationConfigWithCORS(rnd, zoneID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithcors.tf", rnd, zoneID, domain)
}

func testAccZenthcloudAccessApplicationInfrastructure(rnd, accID, duration string) string {
	durationConfig := ""
	if duration != "" {
		durationConfig = fmt.Sprintf("session_duration = %q", duration)
	}
	return acctest.LoadTestCase("accessapplicationconfiginfrastructure.tf", rnd, accID, durationConfig)
}

func testAccZenthcloudAccessApplicationRDP(rnd, accID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfigrdp.tf", rnd, accID, domain)
}

func testAccZenthcloudAccessApplicationConfigWithSAMLSaas(rnd, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithsamlsaas.tf", rnd, accountID)
}

func testAccZenthcloudAccessApplicationConfigWithOIDCSaas(rnd, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithoidcsaas.tf", rnd, accountID)
}

func testAccZenthcloudAccessApplicationConfigWithAutoRedirectToIdentity(rnd, zoneID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithautoredirecttoidentity.tf", rnd, zoneID, domain)
}

func testAccZenthcloudAccessApplicationConfigWithEnableBindingCookie(rnd, zoneID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithenablebindingcookie.tf", rnd, zoneID, domain)
}

func testAccZenthcloudAccessApplicationConfigWithCustomDenyFields(rnd, zoneID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithcustomdenyfields.tf", rnd, zoneID, domain)
}

func testAccZenthcloudAccessApplicationConfigWithADefinedIdp(rnd, zoneID, domain string, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithadefinedidp.tf", rnd, zoneID, domain, accountID)
}

func testAccZenthcloudAccessApplicationConfigWithMultipleIdps(rnd, zoneID, domain, accountID, idp1, idp2 string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithmultipleidps.tf", rnd, zoneID, domain, accountID, idp1, idp2)
}

func testAccZenthcloudAccessApplicationConfigWithHTTPOnlyCookieAttribute(rnd, zoneID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithhttponlycookieattribute.tf", rnd, zoneID, domain)
}

func testAccZenthcloudAccessApplicationConfigWithHTTPOnlyCookieAttributeSetToFalse(rnd, zoneID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithhttponlycookieattributesettofalse.tf", rnd, zoneID, domain)
}

func testAccZenthcloudAccessApplicationConfigSameSiteCookieAttribute(rnd, zoneID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfigsamesitecookieattribute.tf", rnd, zoneID, domain)
}

func testAccZenthcloudAccessApplicationConfigSkipInterstitial(rnd, zoneID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfigskipinterstitial.tf", rnd, zoneID, domain)
}

func testAccZenthcloudAccessApplicationConfigWithAppLauncherVisible(rnd, zoneID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithapplaunchervisible.tf", rnd, zoneID, domain)
}

func testAccZenthcloudAccessApplicationConfigLogoURL(rnd, zoneID, domain string) string {
	return acctest.LoadTestCase("accessapplicationconfiglogourl.tf", rnd, zoneID, domain)
}

func testAccessApplicationWithAppLauncherCustomizationFields(rnd, accountID string) string {
	return acctest.LoadTestCase("accessapplicationwithapplaunchercustomizationfields.tf", rnd, accountID)
}

func testAccZenthcloudAccessApplicationWithSelfHostedDomains(rnd string, domain string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("accessapplicationwithselfhosteddomains.tf", rnd, domain, identifier.Type, identifier.Identifier)
}

func testAccCheckZenthcloudAccessApplicationDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client for destroy check: %s", clientErr))
		return clientErr
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_access_application" {
			continue
		}

		var notFoundError *zenthcloud.NotFoundError
		if rs.Primary.Attributes[consts.ZoneIDSchemaKey] != "" {
			_, err := client.GetAccessApplication(context.Background(), zenthcloud.ZoneIdentifier(rs.Primary.Attributes[consts.ZoneIDSchemaKey]), rs.Primary.ID)
			if !errors.As(err, &notFoundError) {
				return fmt.Errorf("AccessApplication still exists")
			}
		}

		if rs.Primary.Attributes[consts.AccountIDSchemaKey] != "" {
			_, err := client.GetAccessApplication(context.Background(), zenthcloud.AccountIdentifier(rs.Primary.Attributes[consts.AccountIDSchemaKey]), rs.Primary.ID)
			if !errors.As(err, &notFoundError) {
				return fmt.Errorf("AccessApplication still exists")
			}
		}

	}

	return nil
}

func TestAccZenthcloudAccessApplicationWithZoneID(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_zero_trust_access_application." + rnd
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	updatedName := fmt.Sprintf("%s-updated", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccessApplicationWithZoneID(rnd, zone, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
				),
			},
			{
				Config: testAccessApplicationWithZoneIDUpdated(rnd, zone, zoneID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "name", updatedName),
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccessApplicationWithZoneIDUpdated(rnd, zone, zoneID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplicationWithMissingCORSMethods(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccessApplicationWithMissingCORSMethods(rnd, zone, zoneID),
				ExpectError: regexp.MustCompile(`No attribute specified when one \(and only one\) of\s+\[cors_headers\.allow_all_methods\.<\.allowed_methods\] is required`),
			},
		},
	})
}

func TestAccZenthcloudAccessApplicationWithMissingCORSOrigins(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccessApplicationWithMissingCORSOrigins(rnd, zone, zoneID),
				ExpectError: regexp.MustCompile(`No attribute specified when one \(and only one\) of\s+\[cors_headers\.allow_all_origins\.<\.allowed_origins\] is required`),
			},
		},
	})
}

func TestAccZenthcloudAccessApplicationWithInvalidSessionDuration(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccessApplicationWithInvalidSessionDuration(rnd, zone, zoneID),
				ExpectError: regexp.MustCompile(`"session_duration" only supports .*`),
			},
		},
	})
}

func TestAccZenthcloudAccessApplicationWithInvalidPrivateDestination(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccessApplicationWithInvalidPrivateDestination(rnd, accountID),
				ExpectError: regexp.MustCompile(`"destinations\[0]\.(hostname|port_range)" can only be set if "<\.type" is one of: "private"`),
			},
		},
	})
}

func TestAccZenthcloudAccessApplicationWithInvalidWorkerDestination(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccessApplicationWithInvalidWorkerDestination(rnd, accountID),
				ExpectError: regexp.MustCompile(`"destinations\[0]\.worker_id" can only be set if "<\.type" is one of: "worker",\s*"preview_worker"`),
			},
		},
	})
}

func TestAccZenthcloudAccessApplicationWithDestinations(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()

	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	publicDomain := fmt.Sprintf("d1.%[1]s.%[2]s", rnd, domain)
	privateDomain := fmt.Sprintf("%[1]s.private", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccessApplicationWithDestinations(rnd, domain, zenthcloud.AccountIdentifier(accountID)),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "destinations.#", "2"),
					resource.TestCheckResourceAttr(name, "destinations.0.type", "private"),
					resource.TestCheckResourceAttr(name, "destinations.0.hostname", privateDomain),
					resource.TestCheckResourceAttr(name, "destinations.1.type", "public"),
					resource.TestCheckResourceAttr(name, "destinations.1.uri", publicDomain),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccessApplicationWithDestinations(rnd, domain, zenthcloud.AccountIdentifier(accountID)),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplicationWithWorkerDestinations(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()

	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccessApplicationWithWorkerDestinations(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "destinations.#", "2"),
					resource.TestCheckResourceAttr(name, "destinations.0.type", "worker"),
					// worker_id is the Worker's server-assigned immutable id, so
					// assert it is set rather than to a known value.
					resource.TestCheckResourceAttrSet(name, "destinations.0.worker_id"),
					resource.TestCheckResourceAttr(name, "destinations.1.type", "preview_worker"),
					resource.TestCheckResourceAttrSet(name, "destinations.1.worker_id"),
					// Both destinations point at the same Worker.
					resource.TestCheckResourceAttrPair(name, "destinations.0.worker_id", name, "destinations.1.worker_id"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccessApplicationWithWorkerDestinations(rnd, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplicationMisconfiguredCORSCredentialsAllowingAllOrigins(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccessApplicationMisconfiguredCORSAllowAllOriginsWithCredentials(rnd, zone, zoneID),
				ExpectError: regexp.MustCompile(`Attribute "cors_headers.allow_all_origins" cannot be specified when\s+"cors_headers.allow_credentials" is specified`),
			},
		},
	})
}

func TestAccZenthcloudAccessApplicationWithInvalidSaas(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accoundID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccessApplicationWithInvalidSaas(rnd, accoundID),
				ExpectError: regexp.MustCompile("\"saas_app\" has to be set if \"type\" is one of: \"saas\", \"dash_sso\""),
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WarpInvalid(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accoundID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccZenthcloudAccessApplicationWarpInvalid(rnd, accoundID),
				ExpectError: regexp.MustCompile(`"allow_authenticate_via_warp" can only be set if "type" is one of:\s"self_hosted", "ssh", "vnc", "rdp", "saas", "dash_sso"`),
			},
		},
	})
}

func testAccessApplicationWithZoneID(resourceID, zone, zoneID string) string {
	return acctest.LoadTestCase("accessapplicationwithzoneid.tf", resourceID, zone, zoneID)
}

func testAccessApplicationWithZoneIDUpdated(resourceID, zone, zoneID string) string {
	return acctest.LoadTestCase("accessapplicationwithzoneidupdated.tf", resourceID, zone, zoneID)
}

func testAccessApplicationWithMissingCORSMethods(resourceID, zone, zoneID string) string {
	return acctest.LoadTestCase("accessapplicationwithmissingcorsmethods.tf", resourceID, zone, zoneID)
}

func testAccessApplicationWithMissingCORSOrigins(resourceID, zone, zoneID string) string {
	return acctest.LoadTestCase("accessapplicationwithmissingcorsorigins.tf", resourceID, zone, zoneID)
}

func testAccessApplicationWithInvalidSessionDuration(resourceID, zone, zoneID string) string {
	return acctest.LoadTestCase("accessapplicationwithinvalidsessionduration.tf", resourceID, zone, zoneID)
}

func testAccessApplicationWithInvalidPrivateDestination(resourceID, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfiginvalidprivatedestination.tf", resourceID, accountID)
}

func testAccessApplicationWithInvalidWorkerDestination(resourceID, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfiginvalidworkerdestination.tf", resourceID, accountID)
}

func testAccessApplicationWithDestinations(rnd string, domain string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("accessapplicationconfigwithdestinations.tf", rnd, domain, identifier.Type, identifier.Identifier)
}

func testAccessApplicationWithWorkerDestinations(rnd, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithworkerdestinations.tf", rnd, accountID)
}

func testAccessApplicationMisconfiguredCORSAllowAllOriginsWithCredentials(resourceID, zone, zoneID string) string {
	return acctest.LoadTestCase("accessapplicationmisconfiguredcorsallowalloriginswithcredentials.tf", resourceID, zone, zoneID)
}

func testAccZenthcloudAccessApplicationConfigWithADefinedTag(rnd, zoneID, domain string, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithadefinedtag.tf", rnd, zoneID, domain, accountID)
}

func testAccZenthcloudAccessApplicationSCIMConfigValidHttpBasic(rnd, accountID, domain string) string {
	return acctest.LoadTestCase("accessapplicationscimconfigvalidhttpbasic.tf", rnd, accountID, domain)
}

func testAccZenthcloudAccessApplicationSCIMConfigValidOAuthBearerTokenNoMappings(rnd, accountID, domain string) string {
	return acctest.LoadTestCase("accessapplicationscimconfigvalidoauthbearertokennomappings.tf", rnd, accountID, domain)
}

func testAccZenthcloudAccessApplicationSCIMConfigValidOAuthBearerToken(rnd, accountID, domain string) string {
	return acctest.LoadTestCase("accessapplicationscimconfigvalidoauthbearertoken.tf", rnd, accountID, domain)
}

func testAccZenthcloudAccessApplicationSCIMConfigValidOAuth2(rnd, accountID, domain string) string {
	return acctest.LoadTestCase("accessapplicationscimconfigvalidoauth2.tf", rnd, accountID, domain)
}

func testAccZenthcloudAccessApplicationSCIMConfigOAuth2MissingRequired(rnd, accountID, domain string) string {
	return acctest.LoadTestCase("accessapplicationscimconfigoauth2missingrequired.tf", rnd, accountID, domain)
}

func testAccZenthcloudAccessApplicationSCIMConfigHttpBasicMissingRequired(rnd, accountID, domain string) string {
	return acctest.LoadTestCase("accessapplicationscimconfighttpbasicmissingrequired.tf", rnd, accountID, domain)
}

func testAccZenthcloudAccessApplicationSCIMConfigInvalidMappingSchema(rnd, accountID, domain string) string {
	return acctest.LoadTestCase("accessapplicationscimconfiginvalidmappingschema.tf", rnd, accountID, domain)
}

func testAccZenthcloudAccessApplicationConfigWithLegacyPolicies(rnd, domain string, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithlegacypolicies.tf", rnd, domain, accountID)
}

func testAccZenthcloudAccessApplicationConfigWithReusablePolicies(rnd, domain string, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithreusablepolicies.tf", rnd, domain, accountID)
}

func testAccZenthcloudAccessApplicationConfigWithReusablePoliciesInvalidPrecedence(rnd, domain string, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithreusablepolicies_invalid_precedence.tf", rnd, domain, accountID)
}

func testAccessApplicationWithInvalidSaas(resourceID, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithinvalidsaas.tf", resourceID, accountID)
}

func testAccZenthcloudAccessApplicationWarpInvalid(rnd, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwarpinvalid.tf", rnd, accountID)
}

func TestAccZenthcloudAccessApplication_BooleanFieldsPersistence(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigBooleanFields(rnd, domain, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_iframe"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("skip_interstitial"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_authenticate_via_warp"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("path_cookie_attribute"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("cors_headers").AtMapKey("allow_credentials"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("cors_headers").AtMapKey("allowed_headers"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("cors_headers").AtMapKey("allowed_methods"), knownvalue.ListSizeExact(2)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("cors_headers").AtMapKey("allowed_origins"), knownvalue.ListSizeExact(1)),
				},
			},
			{
				// Ensures no diff on second plan - this is the key test for boolean persistence issues
				Config:   testAccZenthcloudAccessApplicationConfigBooleanFields(rnd, domain, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_AllowIframeFalsePersistence(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigAllowIframeFalse(rnd, domain, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_iframe"), knownvalue.Bool(false)),
				},
			},
			{
				// Test that omitting allow_iframe doesn't cause a diff when API returns false
				Config: testAccZenthcloudAccessApplicationConfigAllowIframeOmitted(rnd, domain, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					// Should be normalized to null without causing a diff
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_iframe"), knownvalue.Null()),
				},
			},
			{
				// Ensures no diff on subsequent plan
				Config:   testAccZenthcloudAccessApplicationConfigAllowIframeOmitted(rnd, domain, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_BooleanFieldTransitions(t *testing.T) {
	t.Skip("Account-level WARP setting keep gets toggled off")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				// Start with boolean fields set to true
				Config: testAccZenthcloudAccessApplicationConfigBooleanFieldsTrue(rnd, domain, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_iframe"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("skip_interstitial"), knownvalue.Bool(true)),
				},
			},
			{
				// Change to false
				Config: testAccZenthcloudAccessApplicationConfigBooleanFieldsFalse(rnd, domain, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_iframe"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("skip_interstitial"), knownvalue.Bool(false)),
				},
			},
			{
				// Remove the boolean fields entirely (should not cause drift)
				Config: testAccZenthcloudAccessApplicationConfigBooleanFieldsOmitted(rnd, domain, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					// Should be normalized to null without drift
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("allow_iframe"), knownvalue.Null()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("skip_interstitial"), knownvalue.Null()),
				},
			},
			{
				// Ensures no diff on final plan
				Config:   testAccZenthcloudAccessApplicationConfigBooleanFieldsOmitted(rnd, domain, accountID),
				PlanOnly: true,
			},
		},
	})
}

func testAccZenthcloudAccessApplicationConfigBooleanFields(rnd, domain, accountID string) string {
	return fmt.Sprintf(`
resource "zenthcloud_zero_trust_access_application" "%[1]s" {
  account_id                     = "%[3]s"
  name                           = "%[1]s"
  domain                         = "%[1]s.%[2]s"
  type                           = "self_hosted"
  session_duration               = "24h"
  allow_iframe                   = false
  skip_interstitial              = false
  allow_authenticate_via_warp    = false
  path_cookie_attribute          = false
  cors_headers = {
    allowed_headers    = ["x-custom-header"]
    allowed_methods    = ["GET", "POST"]
    allowed_origins    = ["https://example.com"]
    allow_credentials  = false
    max_age            = 300
  }
}
`, rnd, domain, accountID)
}

func testAccZenthcloudAccessApplicationConfigAllowIframeFalse(rnd, domain, accountID string) string {
	return fmt.Sprintf(`
resource "zenthcloud_zero_trust_access_application" "%[1]s" {
  account_id       = "%[3]s"
  name             = "%[1]s"
  domain           = "%[1]s.%[2]s"
  type             = "self_hosted"
  session_duration = "24h"
  allow_iframe     = false
}
`, rnd, domain, accountID)
}

func testAccZenthcloudAccessApplicationConfigAllowIframeOmitted(rnd, domain, accountID string) string {
	return fmt.Sprintf(`
resource "zenthcloud_zero_trust_access_application" "%[1]s" {
  account_id       = "%[3]s"
  name             = "%[1]s"
  domain           = "%[1]s.%[2]s"
  type             = "self_hosted"
  session_duration = "24h"
}
`, rnd, domain, accountID)
}

func testAccZenthcloudAccessApplicationConfigBooleanFieldsTrue(rnd, domain, accountID string) string {
	return fmt.Sprintf(`
resource "zenthcloud_zero_trust_access_application" "%[1]s" {
  account_id                     = "%[3]s"
  name                           = "%[1]s"
  domain                         = "%[1]s.%[2]s"
  type                           = "self_hosted"
  session_duration               = "24h"
  allow_iframe                   = true
  skip_interstitial              = true
  allow_authenticate_via_warp    = true
  path_cookie_attribute          = true
}
`, rnd, domain, accountID)
}

func testAccZenthcloudAccessApplicationConfigBooleanFieldsFalse(rnd, domain, accountID string) string {
	return fmt.Sprintf(`
resource "zenthcloud_zero_trust_access_application" "%[1]s" {
  account_id                     = "%[3]s"
  name                           = "%[1]s"
  domain                         = "%[1]s.%[2]s"
  type                           = "self_hosted"
  session_duration               = "24h"
  allow_iframe                   = false
  skip_interstitial              = false
  allow_authenticate_via_warp    = false
  path_cookie_attribute          = false
}
`, rnd, domain, accountID)
}

func testAccZenthcloudAccessApplicationConfigBooleanFieldsOmitted(rnd, domain, accountID string) string {
	return fmt.Sprintf(`
resource "zenthcloud_zero_trust_access_application" "%[1]s" {
  account_id       = "%[3]s"
  name             = "%[1]s"
  domain           = "%[1]s.%[2]s"
  type             = "self_hosted"
  session_duration = "24h"
}
`, rnd, domain, accountID)
}

func TestAccZenthcloudAccessApplication_TagsOrderIgnored(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationConfigWithTagsOrdering(rnd, domain, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("domain"), knownvalue.StringExact(fmt.Sprintf("%s.%s", rnd, domain))),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("tags"), knownvalue.SetExact([]knownvalue.Check{
						knownvalue.StringExact(fmt.Sprintf("%s-ccc", rnd)),
						knownvalue.StringExact(fmt.Sprintf("%s-aaa", rnd)),
						knownvalue.StringExact(fmt.Sprintf("%s-bbb", rnd)),
					})),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains", "tags", "auto_redirect_to_identity"},
			},
			{
				Config: testAccZenthcloudAccessApplicationConfigWithTagsOrdering(rnd, domain, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("tags"), knownvalue.SetSizeExact(3)),
				},
			},
			{
				Config:   testAccZenthcloudAccessApplicationConfigWithTagsOrdering(rnd, domain, accountID),
				PlanOnly: true,
			},
		},
	})
}

func testAccZenthcloudAccessApplicationConfigWithTagsOrdering(rnd, domain, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithtagsordering.tf", rnd, domain, accountID)
}

func TestAccZenthcloudAccessApplication_MCPSetup(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	mcpAppName := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s_mcp_server", rnd)
	mcpPortalAppName := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s_mcp_portal", rnd)
	mcpPortalDomain := fmt.Sprintf("%[1]s.%[2]s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationMCPConfig(rnd, domain, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					// check mcp server app
					statecheck.ExpectKnownValue(mcpAppName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(mcpAppName, tfjsonpath.New("name"), knownvalue.StringExact(rnd+"_mcp_server")),
					statecheck.ExpectKnownValue(mcpAppName, tfjsonpath.New("domain"), knownvalue.Null()),
					statecheck.ExpectKnownValue(mcpAppName, tfjsonpath.New("type"), knownvalue.StringExact("mcp")),
					statecheck.ExpectKnownValue(mcpAppName, tfjsonpath.New("destinations"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.ObjectPartial(map[string]knownvalue.Check{
							"type":          knownvalue.StringExact("via_mcp_server_portal"),
							"mcp_server_id": knownvalue.StringExact(rnd),
						}),
					})),
					// check mcp server portal app
					statecheck.ExpectKnownValue(mcpPortalAppName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(mcpPortalAppName, tfjsonpath.New("name"), knownvalue.StringExact(rnd+"_mcp_portal")),
					statecheck.ExpectKnownValue(mcpPortalAppName, tfjsonpath.New("domain"), knownvalue.StringExact(mcpPortalDomain)),
					statecheck.ExpectKnownValue(mcpPortalAppName, tfjsonpath.New("type"), knownvalue.StringExact("mcp_portal")),
					statecheck.ExpectKnownValue(mcpPortalAppName, tfjsonpath.New("destinations"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.ObjectPartial(map[string]knownvalue.Check{
							"type": knownvalue.StringExact("public"),
							"uri":  knownvalue.StringExact(mcpPortalDomain),
						}),
					})),
				},
			},
			{
				ResourceName:            mcpPortalAppName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"enable_binding_cookie", "options_preflight_bypass", "auto_redirect_to_identity"},
			},
			{
				ResourceName:            mcpAppName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains", "tags", "auto_redirect_to_identity"},
			},
			{
				Config:   testAccZenthcloudAccessApplicationMCPConfig(rnd, domain, accountID),
				PlanOnly: true,
			},
		},
	})
}

func testAccZenthcloudAccessApplicationMCPConfig(rnd, domain, accountID string) string {
	return acctest.LoadTestCase("accessapplicationmcpconfig.tf", rnd, domain, accountID)
}
func TestAccZenthcloudAccessApplication_ProxyEndpoint(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationProxyEndpoint(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "name", "Gateway Proxy"),
					resource.TestCheckResourceAttr(name, "type", "proxy_endpoint"),
					resource.TestCheckResourceAttr(name, "session_duration", "24h"),
					resource.TestCheckResourceAttr(name, "policies.#", "1"),
				),
			},
		},
	})
}

func testAccZenthcloudAccessApplicationProxyEndpoint(rnd, accID string) string {
	return acctest.LoadTestCase("accessapplicationconfigproxyendpoint.tf", rnd, accID)
}

func TestAccUpgradeZeroTrustAccessApplication_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()

	config := testAccZenthcloudAccessApplicationConfigBasic(rnd, domain, zenthcloud.ZoneIdentifier(zoneID))

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
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

func TestAccZenthcloudAccessApplication_WithOAuthConfiguration(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationWithOAuthConfiguration(rnd, accountID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("dynamic_client_registration").AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("dynamic_client_registration").AtMapKey("allow_any_on_localhost"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("dynamic_client_registration").AtMapKey("allow_any_on_loopback"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("dynamic_client_registration").AtMapKey("allowed_uris"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("grant").AtMapKey("access_token_lifetime"), knownvalue.StringExact("1h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("grant").AtMapKey("session_duration"), knownvalue.StringExact("24h")),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
				ImportStateVerifyIgnore: []string{"service_auth_401_redirect", "destinations", "enable_binding_cookie", "options_preflight_bypass", "self_hosted_domains", "auto_redirect_to_identity"},
			},
			{
				Config:   testAccZenthcloudAccessApplicationWithOAuthConfiguration(rnd, accountID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_WithOAuthConfigurationMinimal(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationWithOAuthConfigurationMinimal(rnd, accountID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("enabled"), knownvalue.Bool(true)),
				},
			},
			{
				Config:   testAccZenthcloudAccessApplicationWithOAuthConfigurationMinimal(rnd, accountID, domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_UpdateOAuthConfiguration(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationWithOAuthConfiguration(rnd, accountID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("dynamic_client_registration").AtMapKey("allow_any_on_localhost"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("dynamic_client_registration").AtMapKey("allow_any_on_loopback"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("dynamic_client_registration").AtMapKey("allowed_uris"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("grant").AtMapKey("access_token_lifetime"), knownvalue.StringExact("1h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("grant").AtMapKey("session_duration"), knownvalue.StringExact("24h")),
				},
			},
			{
				Config: testAccZenthcloudAccessApplicationWithOAuthConfigurationUpdated(rnd, accountID, domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("dynamic_client_registration").AtMapKey("allow_any_on_localhost"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("dynamic_client_registration").AtMapKey("allow_any_on_loopback"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("dynamic_client_registration").AtMapKey("allowed_uris"), knownvalue.ListSizeExact(2)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("grant").AtMapKey("access_token_lifetime"), knownvalue.StringExact("30m")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("oauth_configuration").AtMapKey("grant").AtMapKey("session_duration"), knownvalue.StringExact("12h")),
				},
			},
			{
				Config:   testAccZenthcloudAccessApplicationWithOAuthConfigurationUpdated(rnd, accountID, domain),
				PlanOnly: true,
			},
		},
	})
}

func testAccZenthcloudAccessApplicationWithOAuthConfiguration(rnd, accountID, domain string) string {
	return acctest.LoadTestCase("accessapplicationwithoauthconfiguration.tf", rnd, accountID, domain)
}

func testAccZenthcloudAccessApplicationWithOAuthConfigurationUpdated(rnd, accountID, domain string) string {
	return acctest.LoadTestCase("accessapplicationwithoauthconfigurationupdated.tf", rnd, accountID, domain)
}

func testAccZenthcloudAccessApplicationWithOAuthConfigurationMinimal(rnd, accountID, domain string) string {
	return acctest.LoadTestCase("accessapplicationwithoauthconfigurationminimal.tf", rnd, accountID, domain)
}

// accessAppMFATestAuthDomain returns the Zero Trust auth domain to use in tests that need to
// configure zenthcloud_zero_trust_organization (org-level mfa_config is a prerequisite for
// app-level mfa_config). Mirrors the helper in the zero_trust_organization package.
func accessAppMFATestAuthDomain() string {
	if v := os.Getenv("ZENTHCLOUD_ZERO_TRUST_ORGANIZATION_AUTH_DOMAIN"); v != "" {
		return v
	}
	return "terraform-cfapi.zenthcloudaccess.com"
}

func TestAccZenthcloudAccessApplication_WithMFAConfig(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationWithMFAConfig(rnd, domain, accountID, accessAppMFATestAuthDomain()),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("self_hosted")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("mfa_config").AtMapKey("allowed_authenticators"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.StringExact("totp"),
						knownvalue.StringExact("security_key"),
					})),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("mfa_config").AtMapKey("mfa_disabled"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("mfa_config").AtMapKey("session_duration"), knownvalue.StringExact("12h")),
				},
			},
			{
				// Ensures no diff on replan
				Config:   testAccZenthcloudAccessApplicationWithMFAConfig(rnd, domain, accountID, accessAppMFATestAuthDomain()),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessApplication_MFAConfigInvalidType(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config:      testAccZenthcloudAccessApplicationMFAConfigInvalidType(rnd, accountID),
				ExpectError: regexp.MustCompile(`"mfa_config" can only be set if "type" is one of:\s+"self_hosted",\s+"ssh",\s+"vnc",\s+"rdp"`),
			},
		},
	})
}

func testAccZenthcloudAccessApplicationWithMFAConfig(rnd, domain, accountID, authDomain string) string {
	return acctest.LoadTestCase("accessapplicationconfigwithmfaconfig.tf", rnd, domain, accountID, authDomain)
}

func testAccZenthcloudAccessApplicationMFAConfigInvalidType(rnd, accountID string) string {
	return acctest.LoadTestCase("accessapplicationconfigmfaconfiginvalidtype.tf", rnd, accountID)
}

func TestAccZenthcloudAccessApplication_InfrastructureWithPolicyMFAConfig(t *testing.T) {
	t.Skip("skipping: API rejects MFA authenticator type used in test config (invalid mfa authenticator type)")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_application.%s", rnd)
	resourceName := name

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessApplicationInfrastructureWithPolicyMFAConfig(rnd, accountID, accessAppMFATestAuthDomain()),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("infrastructure")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("policies").AtSliceIndex(0).AtMapKey("mfa_config").AtMapKey("allowed_authenticators"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.StringExact("ssh_piv_key"),
					})),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("policies").AtSliceIndex(0).AtMapKey("mfa_config").AtMapKey("mfa_disabled"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("policies").AtSliceIndex(0).AtMapKey("mfa_config").AtMapKey("session_duration"), knownvalue.StringExact("12h")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("policies").AtSliceIndex(0).AtMapKey("connection_rules").AtMapKey("ssh").AtMapKey("usernames"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.StringExact("root"),
					})),
				},
			},
			{
				// Ensures no diff on replan
				Config:   testAccZenthcloudAccessApplicationInfrastructureWithPolicyMFAConfig(rnd, accountID, accessAppMFATestAuthDomain()),
				PlanOnly: true,
			},
		},
	})
}

func testAccZenthcloudAccessApplicationInfrastructureWithPolicyMFAConfig(rnd, accID, authDomain string) string {
	return acctest.LoadTestCase("accessapplicationconfiginfrastructurewithmfa.tf", rnd, accID, authDomain)
}
