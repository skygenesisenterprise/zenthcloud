package client_certificate_test

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/client_certificates"
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

func init() {
	resource.AddTestSweepers("zenthcloud_client_certificate", &resource.Sweeper{
		Name: "zenthcloud_client_certificate",
		F:    testSweepZenthcloudClientCertificates,
	})
}

func testSweepZenthcloudClientCertificates(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")

	if zoneID == "" {
		tflog.Info(ctx, "ZENTHCLOUD_ZONE_ID not set, skipping client certificate sweep")
		return nil
	}

	certs, err := client.ClientCertificates.List(ctx, client_certificates.ClientCertificateListParams{
		ZoneID: zenthcloud.F(zoneID),
		Status: zenthcloud.F(client_certificates.ClientCertificateListParamsStatusActive),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to list client certificates: %s", err))
		return nil
	}

	for _, cert := range certs.Result {
		tflog.Info(ctx, fmt.Sprintf("Revoking client certificate: %s", cert.ID))
		_, err := client.ClientCertificates.Delete(ctx, cert.ID, client_certificates.ClientCertificateDeleteParams{
			ZoneID: zenthcloud.F(zoneID),
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to revoke client certificate %s: %s", cert.ID, err))
		}
	}

	return nil
}

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func TestAccZenthcloudClientCertificate_FullLifecycle(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_client_certificate.%s", rnd)
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")

	csr, err := generateCSR(domain)
	if err != nil {
		t.Fatalf("failed to generate CSR: %v", err)
	}

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_Domain(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudClientCertificateDestroy,
		Steps: []resource.TestStep{
			// Create and Read
			{
				Config: testAccZenthcloudClientCertificateConfig(rnd, zoneID, csr, 3650),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("validity_days"), knownvalue.Int64Exact(3650)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringExact("active")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("certificate"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("serial_number"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("issued_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("fingerprint_sha256"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("common_name"), knownvalue.StringExact(domain)),
				},
			},
			// Re-apply same config to verify no drift
			{
				Config: testAccZenthcloudClientCertificateConfig(rnd, zoneID, csr, 3650),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Import
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateIdFunc:       testAccZenthcloudClientCertificateImportStateIdFunc(name),
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"reactivate"},
			},
		},
	})
}

func testAccCheckZenthcloudClientCertificateDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_client_certificate" {
			continue
		}

		zoneID := rs.Primary.Attributes["zone_id"]
		certID := rs.Primary.ID

		cert, err := client.ClientCertificates.Get(
			context.Background(),
			certID,
			client_certificates.ClientCertificateGetParams{
				ZoneID: zenthcloud.F(zoneID),
			},
		)

		// If GET fails (404 or other error), consider it destroyed
		if err != nil {
			continue
		}

		// If we can still retrieve it, verify it's in a revoked state
		status := cert.Status
		if status != "revoked" && status != "pending_revocation" {
			return fmt.Errorf("client certificate %s still exists with status %s, expected revoked or pending_revocation after destroy", certID, status)
		}
	}

	return nil
}

func testAccZenthcloudClientCertificateImportStateIdFunc(resourceName string) resource.ImportStateIdFunc {
	return func(s *terraform.State) (string, error) {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return "", fmt.Errorf("resource not found: %s", resourceName)
		}

		zoneID := rs.Primary.Attributes["zone_id"]
		certID := rs.Primary.ID

		return fmt.Sprintf("%s/%s", zoneID, certID), nil
	}
}

func generateCSR(domain string) (string, error) {
	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return "", err
	}

	template := x509.CertificateRequest{
		Subject: pkix.Name{
			CommonName: domain,
		},
		SignatureAlgorithm: x509.SHA256WithRSA,
	}

	csrBytes, err := x509.CreateCertificateRequest(rand.Reader, &template, key)
	if err != nil {
		return "", err
	}

	csrPem := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE REQUEST", Bytes: csrBytes})
	return string(csrPem), nil
}

func testAccZenthcloudClientCertificateConfig(rnd, zoneID, csr string, validityDays int) string {
	return acctest.LoadTestCase("clientcertificatelifecycle.tf", rnd, zoneID, csr, validityDays)
}

// TestAccZenthcloudClientCertificate_CRLFNormalization tests that the provider
// properly handles CSRs with different line endings (\n vs \r\n) and doesn't
// detect drift. The API returns CSRs with \r\n line endings, but user configs
// typically use \n (Unix style). This verifies the normalization logic.
func TestAccZenthcloudClientCertificate_CRLFNormalization(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_client_certificate.%s", rnd)
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")

	csr, err := generateCSR(domain)
	if err != nil {
		t.Fatalf("failed to generate CSR: %v", err)
	}

	// CSR generated with \n line endings (Unix style)
	// API will return with \r\n - normalization should prevent drift

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_Domain(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudClientCertificateDestroy,
		Steps: []resource.TestStep{
			// Create with LF line endings
			{
				Config: testAccZenthcloudClientCertificateCRLFConfig(rnd, zoneID, csr, 3650),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("status"), knownvalue.StringExact("active")),
				},
			},
			// Re-apply same config - should detect no drift despite API returning \r\n
			{
				Config: testAccZenthcloudClientCertificateCRLFConfig(rnd, zoneID, csr, 3650),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
		},
	})
}

func testAccZenthcloudClientCertificateCRLFConfig(rnd, zoneID, csr string, validityDays int) string {
	return acctest.LoadTestCase("clientcertificatecrlfnormalization.tf", rnd, zoneID, csr, validityDays)
}
