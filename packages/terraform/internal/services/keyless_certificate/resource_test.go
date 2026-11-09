package keyless_certificate_test

import (
	"context"
	"errors"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/retry"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_keyless_certificate", &resource.Sweeper{
		Name: "zenthcloud_keyless_certificate",
		F:    testSweepZenthcloudKeylessCertificates,
	})
}

func testSweepZenthcloudKeylessCertificates(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client()
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping keyless certificates sweep: ZENTHCLOUD_ZONE_ID not set")
		return nil
	}

	certificates, err := client.ListKeylessSSL(ctx, zoneID)
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch keyless certificates: %s", err))
		return fmt.Errorf("failed to fetch keyless certificates: %w", err)
	}

	if len(certificates) == 0 {
		tflog.Info(ctx, "No keyless certificates to sweep")
		return nil
	}

	for _, cert := range certificates {
		// Use standard filtering helper on the certificate name
		if !utils.ShouldSweepResource(cert.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting keyless certificate: %s (zone: %s)", cert.Name, zoneID))
		err := client.DeleteKeylessSSL(ctx, zoneID, cert.ID)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete keyless certificate %s: %s", cert.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted keyless certificate: %s", cert.ID))
	}

	return nil
}

func TestAccZenthcloudKeylessSSL_Basic(t *testing.T) {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_keyless_certificate.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudKeylessCertificateDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudKeylessCertificate(rnd, zoneID, domain),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "port", "24008"),
					resource.TestCheckResourceAttr(name, "enabled", "false"),
					resource.TestCheckResourceAttr(name, "name", rnd),
					resource.TestCheckResourceAttr(name, "host", domain),
				),
			},
		},
	})
}

func testAccCheckZenthcloudKeylessCertificateDestroy(s *terraform.State) error {
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_keyless_certificate" {
			continue
		}

		ctx := context.Background()
		err := retry.RetryContext(ctx, time.Second*10, func() *retry.RetryError {
			keylessCertificates, err := client.ListKeylessSSL(ctx, zoneID)
			if err != nil {
				return retry.NonRetryableError(fmt.Errorf("failed to fetch keyless certificate: %w", err))
			}

			for _, keylessCertificate := range keylessCertificates {
				if keylessCertificate.ID == rs.Primary.Attributes["id"] {
					return retry.RetryableError(fmt.Errorf("keyless certificate cleanup is processing"))
				}
			}

			return nil
		})
		if err != nil {
			return errors.New("failed to initiate retries for Keyless SSL deletion")
		}
	}

	return nil
}

func testAccZenthcloudKeylessCertificate(resourceName, zoneId string, domain string) string {
	expiry := time.Now().Add(time.Hour * 730)
	cert, _, _ := utils.GenerateEphemeralCertAndKey([]string{domain}, expiry)

	return acctest.LoadTestCase("keylesscertificate.tf", resourceName, zoneId, domain, cert)
}
