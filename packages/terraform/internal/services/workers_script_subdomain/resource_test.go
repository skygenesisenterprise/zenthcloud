package workers_script_subdomain_test

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/workers"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_workers_script_subdomain", &resource.Sweeper{
		Name: "zenthcloud_workers_script_subdomain",
		F:    testSweepZenthcloudWorkersScriptSubdomain,
	})
}

func testSweepZenthcloudWorkersScriptSubdomain(r string) error {
	ctx := context.Background()
	// Workers Script Subdomain is an account-level subdomain configuration.
	// It's a singleton setting per account, not something that accumulates.
	// No sweeping required.
	tflog.Info(ctx, "Workers Script Subdomain doesn't require sweeping (account setting)")
	return nil
}

func TestAccZenthcloudWorkersScriptSubdomain_Basic(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_workers_script_subdomain." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudWorkersScriptSubdomainDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersScriptSubdomain(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("script_name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateIdFunc: func(s *terraform.State) (string, error) {
					return fmt.Sprintf("%s/%s", accountID, rnd), nil
				},
			},
		},
	})
}

func TestAccZenthcloudWorkersScriptSubdomain_Update(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_workers_script_subdomain." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudWorkersScriptSubdomainDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersScriptSubdomain(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(true)),
				},
			},
			{
				Config: testAccCheckZenthcloudWorkersScriptSubdomainDisabled(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(false)),
				},
			},
		},
	})
}

func TestAccZenthcloudWorkersScriptSubdomain_WithPreviews(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_workers_script_subdomain." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudWorkersScriptSubdomainDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersScriptSubdomainWithPreviews(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("script_name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("enabled"), knownvalue.Bool(true)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("previews_enabled"), knownvalue.Bool(true)),
				},
			},
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateIdFunc: func(s *terraform.State) (string, error) {
					return fmt.Sprintf("%s/%s", accountID, rnd), nil
				},
			},
		},
	})
}

func TestAccZenthcloudWorkersScriptSubdomain_InvalidImportID(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	resourceName := "zenthcloud_workers_script_subdomain." + rnd
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudWorkersScriptSubdomainDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudWorkersScriptSubdomain(rnd, accountID),
			},
			{
				ResourceName:  resourceName,
				ImportState:   true,
				ImportStateId: "invalid-import-id",
				ExpectError:   regexp.MustCompile("invalid ID|expected urlencoded segments"),
			},
			{
				ResourceName:  resourceName,
				ImportState:   true,
				ImportStateId: accountID,
				ExpectError:   regexp.MustCompile("invalid ID|expected urlencoded segments"),
			},
		},
	})
}

func testAccCheckZenthcloudWorkersScriptSubdomainDestroy(s *terraform.State) error {
	client := acctest.SharedClient()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_workers_script_subdomain" {
			continue
		}

		scriptName := rs.Primary.Attributes["script_name"]
		accountID := rs.Primary.Attributes[consts.AccountIDSchemaKey]

		_, err := client.Workers.Scripts.Subdomain.Get(context.Background(), scriptName, workers.ScriptSubdomainGetParams{
			AccountID: zenthcloud.F(accountID),
		})

		if err == nil {
			return fmt.Errorf("workers script subdomain still exists for script %s", scriptName)
		}
	}

	return nil
}

func testAccCheckZenthcloudWorkersScriptSubdomain(rnd, accountID string) string {
	return acctest.LoadTestCase("workersscriptsubdomain.tf", rnd, accountID)
}

func testAccCheckZenthcloudWorkersScriptSubdomainDisabled(rnd, accountID string) string {
	return acctest.LoadTestCase("workersscriptsubdomaindisabled.tf", rnd, accountID)
}

func testAccCheckZenthcloudWorkersScriptSubdomainWithPreviews(rnd, accountID string) string {
	return acctest.LoadTestCase("workersscriptsubdomainwithpreviews.tf", rnd, accountID)
}
