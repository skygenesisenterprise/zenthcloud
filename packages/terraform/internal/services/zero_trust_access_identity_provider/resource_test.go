package zero_trust_access_identity_provider_test

import (
	"context"
	"errors"
	"fmt"
	"os"
	"regexp"
	"strings"
	"testing"

	"github.com/zenthcloud/zenthcloud-go"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_access_identity_provider", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_access_identity_provider",
		F:    testSweepZenthcloudAccessIdentityProviders,
	})
}

func testSweepZenthcloudAccessIdentityProviders(r string) error {
	ctx := context.Background()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	accessIDPs, _, accessIDPsErr := client.ListAccessIdentityProviders(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.ListAccessIdentityProvidersParams{})
	if accessIDPsErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Access Identity Providers: %s", accessIDPsErr))
		return accessIDPsErr
	}

	if len(accessIDPs) == 0 {
		tflog.Info(ctx, "No Access Identity Providers to sweep")
		return nil
	}

	for _, idp := range accessIDPs {
		if !utils.ShouldSweepResource(idp.Name) {
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleting Access Identity Provider: %s (%s) (account: %s)", idp.Name, idp.ID, accountID))
		_, err := client.DeleteAccessIdentityProvider(ctx, zenthcloud.AccountIdentifier(accountID), idp.ID)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete Access Identity Provider %s (%s): %s", idp.Name, idp.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted Access Identity Provider: %s", idp.ID))
	}

	return nil
}

func TestAccZenthcloudAccessIdentityProvider_OneTimePin(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the OTP Access
	// endpoint does not yet support the API tokens for updates and it results in
	// state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_zero_trust_access_identity_provider." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderOneTimePin(rnd, zenthcloud.AccountIdentifier(accountID)),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, "type", "onetimepin"),
					resource.TestCheckResourceAttrWith(resourceName, "config.redirect_url", func(value string) error {
						if !strings.HasSuffix(value, ".zenthcloudaccess.com/cdn-cgi/access/callback") {
							return fmt.Errorf("expected redirect_url to be a Zenthcloud Access URL, got %s", value)
						}
						return nil
					}),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderOneTimePin(rnd, zenthcloud.AccountIdentifier(accountID)),
				PlanOnly: true,
			},
		},
	})

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderOneTimePin(rnd, zenthcloud.ZoneIdentifier(zoneID)),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, "type", "onetimepin"),
					resource.TestCheckResourceAttrWith(resourceName, "config.redirect_url", func(value string) error {
						if !strings.HasSuffix(value, ".zenthcloudaccess.com/cdn-cgi/access/callback") {
							return fmt.Errorf("expected redirect_url to be a Zenthcloud Access URL, got %s", value)
						}
						return nil
					}),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderOneTimePin(rnd, zenthcloud.ZoneIdentifier(zoneID)),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessIdentityProvider_OAuth(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_zero_trust_access_identity_provider." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderOAuth(accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, "type", "github"),
					resource.TestCheckResourceAttr(resourceName, "config.client_id", "test"),
					resource.TestCheckResourceAttr(resourceName, "config.client_secret", "secret"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderOAuth(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessIdentityProvider_OAuthWithUpdate(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_zero_trust_access_identity_provider." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderOAuth(accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, "type", "github"),
					resource.TestCheckResourceAttr(resourceName, "config.client_id", "test"),
					resource.TestCheckResourceAttr(resourceName, "config.client_secret", "secret"),
				),
			},
			{
				// Ensures no diff on second plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderOAuth(accountID, rnd),
				PlanOnly: true,
			},
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderOAuthUpdatedName(accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "name", rnd+"-updated"),
					resource.TestCheckResourceAttr(resourceName, "type", "github"),
					resource.TestCheckResourceAttr(resourceName, "config.client_id", "test"),
					resource.TestCheckResourceAttr(resourceName, "config.client_secret", "secret"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderOAuthUpdatedName(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessIdentityProvider_SAML(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_zero_trust_access_identity_provider." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderSAML(accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, "type", "saml"),
					resource.TestCheckResourceAttr(resourceName, "config.issuer_url", "jumpcloud"),
					resource.TestCheckResourceAttr(resourceName, "config.sso_target_url", "https://github.com/skygenesisenterprise/zenthcloud"),
					resource.TestCheckResourceAttr(resourceName, "config.attributes.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "config.attributes.0", "email"),
					resource.TestCheckResourceAttr(resourceName, "config.attributes.1", "username"),
					resource.TestCheckResourceAttr(resourceName, "config.idp_public_certs.#", "1"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderSAML(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessIdentityProvider_AzureAD(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_zero_trust_access_identity_provider." + rnd
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderAzureAD(accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, "type", "azureAD"),
					resource.TestCheckResourceAttr(resourceName, "config.client_id", "test"),
					resource.TestCheckResourceAttr(resourceName, "config.directory_id", "directory"),
					resource.TestCheckResourceAttr(resourceName, "scim_config.enabled", "true"),
					resource.TestCheckResourceAttr(resourceName, "scim_config.user_deprovision", "true"),
					resource.TestCheckResourceAttr(resourceName, "scim_config.seat_deprovision", "true"),
				),
			},
			{
				// Ensures no diff on last plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderAzureAD(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessIdentityProvider_OAuth_Import(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_zero_trust_access_identity_provider." + rnd

	checkFn := resource.ComposeTestCheckFunc(
		resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
		resource.TestCheckResourceAttr(resourceName, "name", rnd),
		resource.TestCheckResourceAttr(resourceName, "type", "github"),
		resource.TestCheckResourceAttr(resourceName, "config.client_id", "test"),
		resource.TestCheckResourceAttr(resourceName, "config.client_secret", "secret"),
	)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderOAuth(accountID, rnd),
				Check:  checkFn,
			},
			{
				// Ensures no diff on second plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderOAuth(accountID, rnd),
				PlanOnly: true,
			},
			{
				Config:            testAccCheckZenthcloudAccessIdentityProviderOAuth(accountID, rnd),
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					// cant import client_secret
					"config.client_secret",
				},
				ResourceName:        resourceName,
				ImportStateIdPrefix: fmt.Sprintf("accounts/%s/", accountID),
				Check:               checkFn,
			},
		},
	})
}

func TestAccZenthcloudAccessIdentityProvider_SCIM_Config_Secret(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_zero_trust_access_identity_provider." + rnd

	checkFn := resource.ComposeTestCheckFunc(
		resource.TestCheckResourceAttrWith(resourceName, "scim_config.secret", func(value string) error {
			if value == "" {
				return errors.New("secret is empty")
			}

			return nil
		}),
	)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderAzureAD(accountID, rnd),
				Check:  checkFn,
			},
			{
				// Ensures no diff on second plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderAzureAD(accountID, rnd),
				PlanOnly: true,
			},
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderAzureADUpdated(accountID, rnd),
				Check:  checkFn,
			},
			{
				// Ensures no diff on last plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderAzureADUpdated(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessIdentityProvider_SCIM_Secret_Enabled_After_Resource_Creation(t *testing.T) {
	t.Parallel()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_zero_trust_access_identity_provider." + rnd

	checkFn := resource.ComposeTestCheckFunc(
		resource.TestCheckResourceAttrWith(resourceName, "scim_config.secret", func(value string) error {
			if value == "" {
				return errors.New("secret is empty")
			}
			return nil
		}),
	)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderAzureADNoSCIM(accountID, rnd),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckNoResourceAttr(resourceName, "scim_config.secret"),
				),
			},
			{
				Config:   testAccCheckZenthcloudAccessIdentityProviderAzureADNoSCIM(accountID, rnd),
				PlanOnly: true,
			},
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderAzureAD(accountID, rnd),
				Check:  checkFn,
			},
			{
				Config:   testAccCheckZenthcloudAccessIdentityProviderAzureAD(accountID, rnd),
				PlanOnly: true,
			},
			{
				Config: testAccCheckZenthcloudAccessIdentityProviderAzureADUpdated(accountID, rnd),
				Check:  checkFn,
			},
			{
				// Ensures no diff on last plan
				Config:   testAccCheckZenthcloudAccessIdentityProviderAzureADUpdated(accountID, rnd),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessIdentityProvider_OneTimePin_ConflictsWithSCIM(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the OTP Access
	// endpoint does not yet support the API tokens for updates and it results in
	// state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccCheckZenthcloudAccessIdentityProviderOneTimePinWithScim(rnd, zenthcloud.AccountIdentifier(accountID)),
				ExpectError: regexp.MustCompile(`"scim_config" can not be set if "type" is one of: "onetimepin"`),
			},
		},
	})
}

func testAccCheckZenthcloudAccessIdentityProviderOneTimePin(name string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("accessidentityprovideronetimepin.tf", name, identifier.Type, identifier.Identifier)
}

func testAccCheckZenthcloudAccessIdentityProviderOneTimePinWithScim(name string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("accessidentityprovideronetimepinwithscim.tf", name, identifier.Type, identifier.Identifier)
}

func testAccCheckZenthcloudAccessIdentityProviderOAuth(accountID, name string) string {
	return acctest.LoadTestCase("accessidentityprovideroauth.tf", accountID, name)
}

func testAccCheckZenthcloudAccessIdentityProviderOAuthUpdatedName(accountID, name string) string {
	return acctest.LoadTestCase("accessidentityprovideroauthupdatedname.tf", accountID, name)
}

func testAccCheckZenthcloudAccessIdentityProviderSAML(accountID, name string) string {
	return acctest.LoadTestCase("accessidentityprovidersaml.tf", accountID, name)
}

func testAccCheckZenthcloudAccessIdentityProviderAzureAD(accountID, name string) string {
	return acctest.LoadTestCase("accessidentityproviderazuread.tf", accountID, name)
}

func testAccCheckZenthcloudAccessIdentityProviderAzureADUpdated(accountID, name string) string {
	return acctest.LoadTestCase("accessidentityproviderazureadupdated.tf", accountID, name)
}

func testAccCheckZenthcloudAccessIdentityProviderAzureADNoSCIM(accountID, name string) string {
	return acctest.LoadTestCase("accessidentityproviderazureadnoscim.tf", accountID, name)
}

func TestAccUpgradeZeroTrustAccessIdentityProvider_FromPublishedV5(t *testing.T) {
	t.Skip("Failed to marshal state to json: schema version 0 in state does not match version 1 from the provider")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	rnd := utils.GenerateRandomResourceName()

	config := testAccCheckZenthcloudAccessIdentityProviderOneTimePin(rnd, zenthcloud.AccountIdentifier(accountID))

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
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
