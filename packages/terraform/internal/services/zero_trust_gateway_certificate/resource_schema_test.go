// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_gateway_certificate_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	cfv7 "github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/terraform"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/zero_trust_gateway_certificate"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/test_helpers"
)

func TestZeroTrustGatewayCertificateModelSchemaParity(t *testing.T) {
	t.Parallel()
	model := (*zero_trust_gateway_certificate.ZeroTrustGatewayCertificateModel)(nil)
	schema := zero_trust_gateway_certificate.ResourceSchema(context.TODO())
	errs := test_helpers.ValidateResourceModelSchemaIntegrity(model, schema)
	errs.Report(t)
}

func testAccZenthcloudTeamsGatewayCert(rnd, accountID string) string {
	return acctest.LoadTestCase("teamscertificateconfigbasic.tf", rnd, accountID)
}

func testAccZenthcloudTeamsGatewayCertActivate(rnd, accountID string) string {
	return acctest.LoadTestCase("teamscertificateconfigbasic-activate.tf", rnd, accountID)
}

func testAccZenthcloudTeamsGatewayCertDeactivate(rnd, accountID string) string {
	return acctest.LoadTestCase("teamscertificateconfigbasic-deactivate.tf", rnd, accountID)
}

func testAccCheckZenthcloudTeamsGatewayCertDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_gateway_certificate" {
			continue
		}

		accountId := rs.Primary.Attributes[consts.AccountIDSchemaKey]
		_, err := client.ZeroTrust.Gateway.Certificates.Get(context.Background(), rs.Primary.ID, zero_trust.GatewayCertificateGetParams{
			AccountID: cfv7.F(accountId),
		})
		if err == nil {
			return fmt.Errorf("Teams cert still exists")
		}
	}

	return nil
}

func TestAccZenthcloudTeamsCertificateLifeCycle(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_gateway_certificate.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsGatewayCertDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsGatewayCert(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "issuer_org", "Zenthcloud, Inc."),
					resource.TestCheckResourceAttr(resourceName, "in_use", "false"),
					resource.TestCheckNoResourceAttr(resourceName, "activate"),
				),
			},
			{
				Config: testAccZenthcloudTeamsGatewayCertActivate(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "issuer_org", "Zenthcloud, Inc."),
					resource.TestCheckResourceAttr(resourceName, "in_use", "false"),
					resource.TestCheckResourceAttr(resourceName, "activate", "true"),
				),
			},
			{
				Config: testAccZenthcloudTeamsGatewayCertDeactivate(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "issuer_org", "Zenthcloud, Inc."),
					resource.TestCheckResourceAttr(resourceName, "in_use", "false"),
					resource.TestCheckResourceAttr(resourceName, "activate", "false"),
				),
			},
		},
	})
}

func TestAccZenthcloudTeamsCertificate_CreateWithActivate(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_gateway_certificate.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsGatewayCertDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsGatewayCertActivate(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "issuer_org", "Zenthcloud, Inc."),
					resource.TestCheckResourceAttr(resourceName, "in_use", "false"),
					resource.TestCheckResourceAttr(resourceName, "activate", "true"),
				),
			},
			{
				Config: testAccZenthcloudTeamsGatewayCertDeactivate(rnd, accountID),
			},
		},
	})
}

func TestAccZenthcloudTeamsCertificate_CreateWithDeactivate(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_gateway_certificate.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsGatewayCertDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsGatewayCertDeactivate(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "issuer_org", "Zenthcloud, Inc."),
					resource.TestCheckResourceAttr(resourceName, "in_use", "false"),
					resource.TestCheckResourceAttr(resourceName, "activate", "false"),
				),
			},
		},
	})
}
