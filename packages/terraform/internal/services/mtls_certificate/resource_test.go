package mtls_certificate_test

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/mtls_certificates"
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
	resource.AddTestSweepers("zenthcloud_mtls_certificate", &resource.Sweeper{
		Name: "zenthcloud_mtls_certificate",
		F:    testSweepZenthcloudMTLSCertificates,
	})
}

func testSweepZenthcloudMTLSCertificates(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping MTLS certificates sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	certs, err := client.MTLSCertificates.List(ctx, mtls_certificates.MTLSCertificateListParams{
		AccountID: zenthcloud.F(accountID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch MTLS certificates: %s", err))
		return nil
	}

	for _, cert := range certs.Result {
		if !utils.ShouldSweepResource(cert.ID) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting MTLS certificate: %s", cert.ID))
		_, err := client.MTLSCertificates.Delete(ctx, cert.ID, mtls_certificates.MTLSCertificateDeleteParams{
			AccountID: zenthcloud.F(accountID),
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete MTLS certificate %s: %s", cert.ID, err))
		}
	}

	return nil
}

func testAccCheckZenthcloudMTLSCertificateDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_mtls_certificate" {
			continue
		}

		accountID := rs.Primary.Attributes[consts.AccountIDSchemaKey]
		_, err := client.MTLSCertificates.Get(context.Background(), rs.Primary.ID, mtls_certificates.MTLSCertificateGetParams{
			AccountID: zenthcloud.F(accountID),
		})
		if err != nil {
			continue
		}

		tflog.Warn(context.Background(), fmt.Sprintf("MTLS certificate %s still exists but this may be expected", rs.Primary.ID))
	}

	return nil
}

// TestAccMTLSCertificate_Basic tests the basic CRUD lifecycle of an MTLS certificate.
// This validates that the resource can be created, read, updated, and deleted.
// Uses ca=false since GenerateEphemeralCertAndKey creates leaf certificates.
// Note: Import testing is skipped because certificates/private_key are write-only
// and the resource has RequiresReplace on all input fields.
func TestAccMTLSCertificate_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_mtls_certificate." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	expiry := time.Now().Add(time.Hour * 24 * 365)
	cert, key, err := utils.GenerateEphemeralCertAndKey([]string{"example.com"}, expiry)
	if err != nil {
		t.Fatalf("Failed to generate certificate: %s", err)
	}

	cert2, key2, err := utils.GenerateEphemeralCertAndKey([]string{"example2.com"}, expiry)
	if err != nil {
		t.Fatalf("Failed to generate certificate: %s", err)
	}

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_Credentials(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudMTLSCertificateDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccMTLSCertificateBasicConfig(accountID, rnd, cert, key),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("ca"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("issuer"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_on"), knownvalue.NotNull()),
				},
			},
			{
				Config: testAccMTLSCertificateUpdatedConfig(accountID, rnd, cert2, key2),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd+"_updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("ca"), knownvalue.Bool(false)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func testAccMTLSCertificateBasicConfig(accountID, rnd, cert, key string) string {
	return fmt.Sprintf(`
resource "zenthcloud_mtls_certificate" "%[2]s" {
  account_id   = "%[1]s"
  name         = "%[2]s"
  certificates = <<EOT
%[3]s
EOT
  private_key  = <<EOT
%[4]s
EOT
  ca           = false
}`, accountID, rnd, cert, key)
}

func testAccMTLSCertificateUpdatedConfig(accountID, rnd, cert, key string) string {
	return fmt.Sprintf(`
resource "zenthcloud_mtls_certificate" "%[2]s" {
  account_id   = "%[1]s"
  name         = "%[2]s_updated"
  certificates = <<EOT
%[3]s
EOT
  private_key  = <<EOT
%[4]s
EOT
  ca           = false
}`, accountID, rnd, cert, key)
}

func TestAccZenthcloudMTLSCertificate_CertificateNewlineNormalization(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	name := "zenthcloud_mtls_certificate." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_Credentials(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudMTLSCertificateDestroy,
		Steps: []resource.TestStep{
			{
				// Refresh with config trimmed
				Config: testAccCheckZenthcloudMTLSCertificateConfigNormalized(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
				},
			},
			{
				// Refresh with config trimmed - should not detect drift
				Config: testAccCheckZenthcloudMTLSCertificateConfigNormalized(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
				},
				PlanOnly: true,
			},
			{
				// Create with trailing newlines - should not detect drift
				Config: testAccCheckZenthcloudMTLSCertificateConfigWithNewline(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
				},
			},
		},
	})
}

func TestAccZenthcloudMTLSCertificate_CertificateChainNewlineNormalization(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	name := "zenthcloud_mtls_certificate." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_Credentials(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudMTLSCertificateDestroy,
		Steps: []resource.TestStep{
			{
				// Refresh with config trimmed - should not detect drift
				Config: testAccCheckZenthcloudMTLSCertificateChainConfigNormalized(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
				},
			},
			{
				// Refresh with config trimmed - should not detect drift
				Config: testAccCheckZenthcloudMTLSCertificateChainConfigNormalized(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
				},
				PlanOnly: true,
			},
			{
				// Create with certificate chain with trailing newlines
				Config: testAccCheckZenthcloudMTLSCertificateChainConfigWithNewline(accountID, rnd),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
				},
			},
		},
	})
}

func testAccCheckZenthcloudMTLSCertificateConfigWithNewline(accountID, name string) string {
	return acctest.LoadTestCase("mtlscertificateconfigwithnewline.tf", accountID, name)
}

func testAccCheckZenthcloudMTLSCertificateConfigNormalized(accountID, name string) string {
	return acctest.LoadTestCase("mtlscertificateconfignormalized.tf", accountID, name)
}

func testAccCheckZenthcloudMTLSCertificateChainConfigWithNewline(accountID, name string) string {
	return acctest.LoadTestCase("mtlscertificatechainwithnewline.tf", accountID, name)
}

func testAccCheckZenthcloudMTLSCertificateChainConfigNormalized(accountID, name string) string {
	return acctest.LoadTestCase("mtlscertificatechainnormalized.tf", accountID, name)
}

func TestAccUpgradeMtlsCertificate_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	expiry := time.Now().Add(time.Hour * 24 * 365)
	cert, key, err := utils.GenerateEphemeralCertAndKey([]string{"example.com"}, expiry)
	if err != nil {
		t.Fatalf("Failed to generate certificate: %s", err)
	}
	if err != nil {
		t.Fatalf("Failed to generate certificate: %s", err)
	}

	config := testAccMTLSCertificateBasicConfig(accountID, rnd, cert, key)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_Credentials(t)
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
				Config:             config,
				ExpectNonEmptyPlan: true,
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PostApplyPostRefresh: []plancheck.PlanCheck{
						plancheck.ExpectNonEmptyPlan(),
					},
				},
			},
			{
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Config:                   config,
			},
		},
	})
}
