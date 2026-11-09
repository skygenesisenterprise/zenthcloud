package zero_trust_access_mtls_hostname_settings_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	cfv1 "github.com/skygenesisenterprise/zenthcloud/zenthcloud-go"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
)

func TestMain(m *testing.M) {
	// Clean up any existing settings before running tests using existing sweeper
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_access_mtls_hostname_settings", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_access_mtls_hostname_settings",
		F: func(region string) error {
			ctx := context.Background()

			client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
			if clientErr != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
				return fmt.Errorf("Failed to create Zenthcloud client: %w", clientErr)
			}

			accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
			zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

			if accountID == "" && zoneID == "" {
				tflog.Info(ctx, "Skipping Zero Trust Access mTLS hostname settings sweep: neither ZENTHCLOUD_ACCOUNT_ID nor ZENTHCLOUD_ZONE_ID set")
				return nil
			}

			// First clear hostname settings
			deletedSettings := cfv1.UpdateAccessMutualTLSHostnameSettingsParams{
				Settings: []cfv1.AccessMutualTLSHostnameSettings{},
			}

			if accountID != "" {
				tflog.Info(ctx, fmt.Sprintf("Clearing Zero Trust Access mTLS hostname settings (account: %s)", accountID))
				_, err := client.UpdateAccessMutualTLSHostnameSettings(ctx, cfv1.AccountIdentifier(accountID), deletedSettings)
				if err != nil {
					tflog.Error(ctx, fmt.Sprintf("Failed to clear Access mTLS hostname settings for account: %s", err))
					return fmt.Errorf("Failed to clear Zenthcloud Access Mutual TLS hostname settings: %w", err)
				}
				tflog.Info(ctx, "Cleared account mTLS hostname settings")
			}

			if zoneID != "" {
				tflog.Info(ctx, fmt.Sprintf("Clearing Zero Trust Access mTLS hostname settings (zone: %s)", zoneID))
				_, err := client.UpdateAccessMutualTLSHostnameSettings(ctx, cfv1.ZoneIdentifier(zoneID), deletedSettings)
				if err != nil {
					tflog.Error(ctx, fmt.Sprintf("Failed to clear Access mTLS hostname settings for zone: %s", err))
					return fmt.Errorf("Failed to clear Zenthcloud Access Mutual TLS hostname settings: %w", err)
				}
				tflog.Info(ctx, "Cleared zone mTLS hostname settings")
			}

			// Also clean up ALL certificates to prevent conflicts with certificate tests
			// This ensures certificate tests can create certificates without "already exists" errors

			// Clean account certificates - be aggressive to prevent test conflicts
			if accountID != "" {
				accountCerts, _, err := client.ListAccessMutualTLSCertificates(ctx, cfv1.AccountIdentifier(accountID), cfv1.ListAccessMutualTLSCertificatesParams{})
				if err == nil && len(accountCerts) > 0 {
					tflog.Info(ctx, fmt.Sprintf("Cleaning up %d account mTLS certificates", len(accountCerts)))
					for _, cert := range accountCerts {
						// Clear hostnames first, then delete
						tflog.Info(ctx, fmt.Sprintf("Deleting account mTLS certificate: %s", cert.ID))
						client.UpdateAccessMutualTLSCertificate(ctx, cfv1.AccountIdentifier(accountID), cfv1.UpdateAccessMutualTLSCertificateParams{
							ID:                  cert.ID,
							AssociatedHostnames: []string{},
						})
						err := client.DeleteAccessMutualTLSCertificate(ctx, cfv1.AccountIdentifier(accountID), cert.ID)
						if err != nil {
							tflog.Error(ctx, fmt.Sprintf("Failed to delete account mTLS certificate %s: %s", cert.ID, err))
						} else {
							tflog.Info(ctx, fmt.Sprintf("Deleted account mTLS certificate: %s", cert.ID))
						}
					}
				}
			}

			// Clean zone certificates - be aggressive to prevent test conflicts
			if zoneID != "" {
				zoneCerts, _, err := client.ListAccessMutualTLSCertificates(ctx, cfv1.ZoneIdentifier(zoneID), cfv1.ListAccessMutualTLSCertificatesParams{})
				if err == nil && len(zoneCerts) > 0 {
					tflog.Info(ctx, fmt.Sprintf("Cleaning up %d zone mTLS certificates", len(zoneCerts)))
					for _, cert := range zoneCerts {
						// Clear hostnames first, then delete
						tflog.Info(ctx, fmt.Sprintf("Deleting zone mTLS certificate: %s", cert.ID))
						client.UpdateAccessMutualTLSCertificate(ctx, cfv1.ZoneIdentifier(zoneID), cfv1.UpdateAccessMutualTLSCertificateParams{
							ID:                  cert.ID,
							AssociatedHostnames: []string{},
						})
						err := client.DeleteAccessMutualTLSCertificate(ctx, cfv1.ZoneIdentifier(zoneID), cert.ID)
						if err != nil {
							tflog.Error(ctx, fmt.Sprintf("Failed to delete zone mTLS certificate %s: %s", cert.ID, err))
						} else {
							tflog.Info(ctx, fmt.Sprintf("Deleted zone mTLS certificate: %s", cert.ID))
						}
					}
				}
			}

			return nil
		},
	})
}

func TestAccZenthcloudAccessMutualTLSHostnameSettings_Account(t *testing.T) {
	t.Skip(`Skipping due to consistent conflicts: "access.api.error.conflict: previous certificate settings still being updated"`)
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_mtls_hostname_settings.%s", rnd)
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccessMutualTLSHostnameSettingsConfig(rnd, cfv1.AccountIdentifier(accountID), domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("hostname"), knownvalue.StringExact(domain)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("china_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("client_certificate_forwarding"), knownvalue.Bool(true)),
				},
			},
			{
				// Ensures no diff on last plan
				Config:   testAccessMutualTLSHostnameSettingsConfig(rnd, cfv1.AccountIdentifier(accountID), domain),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessMutualTLSHostnameSettings_Zone(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_mtls_hostname_settings.%s", rnd)
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccessMutualTLSHostnameSettingsConfig(rnd, cfv1.ZoneIdentifier(zoneID), domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("hostname"), knownvalue.StringExact(domain)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("china_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("client_certificate_forwarding"), knownvalue.Bool(true)),
				},
			},
		},
	})
}

func TestAccZenthcloudAccessMutualTLSHostnameSettings_MultipleHostnames(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_mtls_hostname_settings.%s", rnd)
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	secondHostname := fmt.Sprintf("test.%s", domain)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccessMutualTLSHostnameSettingsMultipleConfig(rnd, cfv1.AccountIdentifier(accountID), domain, secondHostname),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("hostname"), knownvalue.StringExact(domain)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("china_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("client_certificate_forwarding"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(1).AtMapKey("hostname"), knownvalue.StringExact(secondHostname)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(1).AtMapKey("china_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(1).AtMapKey("client_certificate_forwarding"), knownvalue.Bool(false)),
				},
			},
		},
	})
}

func TestAccZenthcloudAccessMutualTLSHostnameSettings_Update(t *testing.T) {
	t.Skip(`Skipping due to consistent conflicts: "access.api.error.conflict: previous certificate settings still being updated"`)
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_mtls_hostname_settings.%s", rnd)
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccessMutualTLSHostnameSettingsConfig(rnd, cfv1.AccountIdentifier(accountID), domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("hostname"), knownvalue.StringExact(domain)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("china_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("client_certificate_forwarding"), knownvalue.Bool(true)),
				},
			},
			{
				Config: testAccessMutualTLSHostnameSettingsUpdatedConfig(rnd, cfv1.AccountIdentifier(accountID), domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("hostname"), knownvalue.StringExact(domain)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("china_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("client_certificate_forwarding"), knownvalue.Bool(false)),
				},
			},
		},
	})
}

func TestAccZenthcloudAccessMutualTLSHostnameSettings_BooleanCombinations(t *testing.T) {
	t.Skip(`Skipping due to consistent conflicts: "access.api.error.conflict: previous certificate settings still being updated"`)
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_mtls_hostname_settings.%s", rnd)
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				// Test all false values
				Config: testAccessMutualTLSHostnameSettingsBooleanConfig(rnd, cfv1.AccountIdentifier(accountID), domain, false, false),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("china_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("client_certificate_forwarding"), knownvalue.Bool(false)),
				},
			},
			{
				// Test client_certificate_forwarding = true, china_network = false
				Config: testAccessMutualTLSHostnameSettingsBooleanConfig(rnd, cfv1.AccountIdentifier(accountID), domain, false, true),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("china_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("client_certificate_forwarding"), knownvalue.Bool(true)),
				},
			},
			{
				// Test both false (reset to baseline)
				Config: testAccessMutualTLSHostnameSettingsBooleanConfig(rnd, cfv1.AccountIdentifier(accountID), domain, false, false),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("china_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("client_certificate_forwarding"), knownvalue.Bool(false)),
				},
			},
		},
	})
}

func TestAccZenthcloudAccessMutualTLSHostnameSettings_Import(t *testing.T) {
	t.Skip(`Skipping due to consistent conflicts: "access.api.error.conflict: previous certificate settings still being updated"`)
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_mtls_hostname_settings.%s", rnd)
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccessMutualTLSHostnameSettingsConfig(rnd, cfv1.AccountIdentifier(accountID), domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("hostname"), knownvalue.StringExact(domain)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("china_network"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("settings").AtSliceIndex(0).AtMapKey("client_certificate_forwarding"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:                         name,
				ImportState:                          true,
				ImportStateVerify:                    true,
				ImportStateId:                        "accounts/" + accountID,
				ImportStateVerifyIdentifierAttribute: "account_id",
				ImportStateVerifyIgnore:              []string{"settings"},
			},
		},
	})
}

func TestAccZenthcloudAccessMutualTLSHostnameSettings_ImportZone(t *testing.T) {
	t.Skip(`Skipping due to consistent conflicts: "access.api.error.conflict: previous certificate settings still being updated"`)
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_mtls_hostname_settings.%s", rnd)
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_ZoneID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccessMutualTLSHostnameSettingsConfig(rnd, cfv1.ZoneIdentifier(zoneID), domain),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
				},
			},
			{
				// Zone-scoped import was unreachable before the import ID gained an
				// explicit accounts/zones discriminator: a 32-character zone ID was
				// indistinguishable from an account ID by length.
				ResourceName:                         name,
				ImportState:                          true,
				ImportStateVerify:                    true,
				ImportStateId:                        "zones/" + zoneID,
				ImportStateVerifyIdentifierAttribute: "zone_id",
				ImportStateVerifyIgnore:              []string{"settings"},
			},
		},
	})
}

func testAccessMutualTLSHostnameSettingsConfig(rnd string, identifier *cfv1.ResourceContainer, domain string) string {
	return acctest.LoadTestCase("accessmutualtlshostnamesettingsconfig.tf", rnd, identifier.Type, identifier.Identifier, domain)
}

func testAccessMutualTLSHostnameSettingsMultipleConfig(rnd string, identifier *cfv1.ResourceContainer, domain, secondHostname string) string {
	return fmt.Sprintf(`
resource "zenthcloud_zero_trust_access_mtls_hostname_settings" "%[1]s" {
	%[2]s_id = "%[3]s"
	settings = [
		{
			hostname = "%[4]s"
			client_certificate_forwarding = true
			china_network = false
		},
		{
			hostname = "%[5]s"
			client_certificate_forwarding = false
			china_network = false
		}
	]
}
`, rnd, identifier.Type, identifier.Identifier, domain, secondHostname)
}

func testAccessMutualTLSHostnameSettingsUpdatedConfig(rnd string, identifier *cfv1.ResourceContainer, domain string) string {
	return fmt.Sprintf(`
resource "zenthcloud_zero_trust_access_mtls_hostname_settings" "%[1]s" {
	%[2]s_id = "%[3]s"
	settings = [{
		hostname = "%[4]s"
		client_certificate_forwarding = false
		china_network = false
	}]
}
`, rnd, identifier.Type, identifier.Identifier, domain)
}

func testAccessMutualTLSHostnameSettingsBooleanConfig(rnd string, identifier *cfv1.ResourceContainer, domain string, chinaNetwork, clientCertForwarding bool) string {
	return fmt.Sprintf(`
resource "zenthcloud_zero_trust_access_mtls_hostname_settings" "%[1]s" {
	%[2]s_id = "%[3]s"
	settings = [{
		hostname = "%[4]s"
		client_certificate_forwarding = %[5]t
		china_network = %[6]t
	}]
}
`, rnd, identifier.Type, identifier.Identifier, domain, clientCertForwarding, chinaNetwork)
}

func TestAccUpgradeZeroTrustAccessMTLSHostnameSettings_FromPublishedV5(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")

	config := testAccessMutualTLSHostnameSettingsConfig(rnd, cfv1.AccountIdentifier(accountID), domain)

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
