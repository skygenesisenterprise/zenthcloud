package certificate_authorities_hostname_associations_test

import (
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudCertificateAuthoritiesHostnameAssociations_FullLifecycle(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_certificate_authorities_hostname_associations.%s", rnd)
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")

	hostname := fmt.Sprintf("%s.%s", rnd, domain)
	hostnameUpdated := fmt.Sprintf("%s-updated.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			// Create and Read
			{
				Config: testAccZenthcloudCertificateAuthoritiesHostnameAssociationsConfig(rnd, zoneID, hostname),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("hostnames"), knownvalue.NotNull()),
				},
			},
			// Re-apply same config to verify no drift
			{
				Config: testAccZenthcloudCertificateAuthoritiesHostnameAssociationsConfig(rnd, zoneID, hostname),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Update hostnames
			{
				Config: testAccZenthcloudCertificateAuthoritiesHostnameAssociationsConfig(rnd, zoneID, hostnameUpdated),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("hostnames"), knownvalue.ListExact(
						[]knownvalue.Check{knownvalue.StringExact(hostnameUpdated)},
					)),
				},
			},
			// Import
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"mtls_certificate_id"},
			},
		},
	})
}

func testAccZenthcloudCertificateAuthoritiesHostnameAssociationsConfig(rnd, zoneID, hostname string) string {
	return acctest.LoadTestCase("certificateauthoritieshostnameassociationslifecycle.tf", rnd, zoneID, hostname)
}

func TestAccZenthcloudCertificateAuthoritiesHostnameAssociations_WithMTLSCertificate(t *testing.T) {
	mtlsCertID := os.Getenv("ZENTHCLOUD_MTLS_CERTIFICATE_ID")
	if mtlsCertID == "" {
		t.Skip("ZENTHCLOUD_MTLS_CERTIFICATE_ID not set, skipping mTLS certificate test")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_certificate_authorities_hostname_associations.%s", rnd)
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	hostname := fmt.Sprintf("%s.%s", rnd, domain)
	hostnameUpdated := fmt.Sprintf("%s-updated.%s", rnd, domain)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			// Create and Read
			{
				Config: testAccZenthcloudCertificateAuthoritiesHostnameAssociationsWithMTLSConfig(rnd, zoneID, hostname, mtlsCertID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("hostnames"), knownvalue.NotNull()),
				},
			},
			// Re-apply same config to verify no drift
			{
				Config: testAccZenthcloudCertificateAuthoritiesHostnameAssociationsWithMTLSConfig(rnd, zoneID, hostname, mtlsCertID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Update hostnames
			{
				Config: testAccZenthcloudCertificateAuthoritiesHostnameAssociationsWithMTLSConfig(rnd, zoneID, hostnameUpdated, mtlsCertID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("zone_id"), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("hostnames"), knownvalue.ListExact(
						[]knownvalue.Check{knownvalue.StringExact(hostnameUpdated)},
					)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("mtls_certificate_id"), knownvalue.StringExact(mtlsCertID)),
				},
			},
			// Import with <zone_id>/<mtls_certificate_id> format
			{
				ResourceName:      name,
				ImportState:       true,
				ImportStateId:     fmt.Sprintf("%s/%s", zoneID, mtlsCertID),
				ImportStateVerify: true,
			},
		},
	})
}

func testAccZenthcloudCertificateAuthoritiesHostnameAssociationsWithMTLSConfig(rnd, zoneID, hostname, mtlsCertID string) string {
	return acctest.LoadTestCase("certificateauthoritieshostnameassociationswithmtls.tf", rnd, zoneID, hostname, mtlsCertID)
}
