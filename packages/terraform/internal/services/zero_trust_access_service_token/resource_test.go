package zero_trust_access_service_token_test

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"testing"

	"github.com/zenthcloud/zenthcloud-go"
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

var (
	accountID = os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	zoneID    = os.Getenv("ZENTHCLOUD_ZONE_ID")
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_access_service_token", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_access_service_token",
		F:    testSweepZenthcloudAccessServiceTokens,
	})
}

func testSweepZenthcloudAccessServiceTokens(r string) error {
	ctx := context.Background()

	client, clientErr := acctest.SharedV1Client()
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
	}

	// Zone level Access Service Tokens.
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	zoneTokens, _, err := client.ListAccessServiceTokens(context.Background(), zenthcloud.ZoneIdentifier(zoneID), zenthcloud.ListAccessServiceTokensParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch zone level Access Service Tokens: %s", err))
	}

	if len(zoneTokens) == 0 {
		log.Print("[DEBUG] No Zenthcloud zone level Access Service Tokens to sweep")
	} else {
		for _, token := range zoneTokens {
			if !utils.ShouldSweepResource(token.Name) {
				continue
			}
			tflog.Info(ctx, fmt.Sprintf("Deleting zone-level Access Service Token: %s (%s)", token.Name, token.ID))
			if _, err := client.DeleteAccessServiceToken(context.Background(), zenthcloud.ZoneIdentifier(zoneID), token.ID); err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to delete zone-level Access Service Token %s (%s): %s", token.Name, token.ID, err))
				continue
			}
			tflog.Info(ctx, fmt.Sprintf("Deleted zone-level Access Service Token: %s (%s)", token.Name, token.ID))
		}
	}

	// Account level Access Service Tokens.
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	accountTokens, _, err := client.ListAccessServiceTokens(context.Background(), zenthcloud.AccountIdentifier(accountID), zenthcloud.ListAccessServiceTokensParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch account level Access Service Tokens: %s", err))
	}

	if len(accountTokens) == 0 {
		log.Print("[DEBUG] No Zenthcloud account level Access Service Tokens to sweep")
		return nil
	}

	for _, token := range accountTokens {
		if !utils.ShouldSweepResource(token.Name) {
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleting account-level Access Service Token: %s (%s)", token.Name, token.ID))
		if _, err := client.DeleteAccessServiceToken(context.Background(), zenthcloud.AccountIdentifier(accountID), token.ID); err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete account-level Access Service Token %s (%s): %s", token.Name, token.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted account-level Access Service Token: %s (%s)", token.Name, token.ID))
	}

	return nil
}

func TestAccZenthcloudAccessServiceToken_BasicAccount(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// Service Tokens endpoint does not yet support the API tokens and it
	// results in misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName+"-updated", zenthcloud.AccountIdentifier(accountID)),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName+"-updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "accounts", accountID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_BasicZone(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// Service Tokens endpoint does not yet support the API tokens and it
	// results in misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.ZoneIdentifier(zoneID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName+"-updated", zenthcloud.ZoneIdentifier(zoneID)),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName+"-updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "zones", zoneID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_DeleteAccount(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// Service Tokens endpoint does not yet support the API tokens and it
	// results in misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_DeleteZone(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// Service Tokens endpoint does not yet support the API tokens and it
	// results in misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.ZoneIdentifier(zoneID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_WithDurationAccount(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// Service Tokens endpoint does not yet support the API tokens and it
	// results in misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfigWithDuration(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID), "forever"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("forever")),
				},
			},
			{
				Config: testZenthcloudAccessServiceTokenBasicConfigWithDuration(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID), "8760h"),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "accounts", accountID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_WithDurationZone(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// Service Tokens endpoint does not yet support the API tokens and it
	// results in misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfigWithDuration(resourceName, resourceName, zenthcloud.ZoneIdentifier(zoneID), "forever"),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("forever")),
				},
			},
			{
				Config: testZenthcloudAccessServiceTokenBasicConfigWithDuration(resourceName, resourceName, zenthcloud.ZoneIdentifier(zoneID), "8760h"),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "zones", zoneID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_PlanModifiers_ClientSecretPersistence(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// Service Tokens endpoint does not yet support the API tokens and it
	// results in misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				// Update the name to test that client_secret is preserved and doesn't show changes in plan
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName+"-updated", zenthcloud.AccountIdentifier(accountID)),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
						// Verify client_secret doesn't appear in plan (plan modifier working)
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName+"-updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "accounts", accountID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
			},
		},
	})

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.ZoneIdentifier(zoneID)),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", resourceName),
					resource.TestCheckResourceAttrSet(name, "client_id"),
					resource.TestCheckResourceAttrSet(name, "client_secret"),
					resource.TestCheckResourceAttrSet(name, "expires_at"),
					resource.TestCheckResourceAttr(name, "duration", "8760h"),
				),
			},
			{
				// Update the name to test that client_secret is preserved and doesn't show changes in plan
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName+"-updated", zenthcloud.ZoneIdentifier(zoneID)),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", resourceName+"-updated"),
					resource.TestCheckResourceAttrSet(name, "client_id"),
					resource.TestCheckResourceAttrSet(name, "client_secret"),
					resource.TestCheckResourceAttrSet(name, "expires_at"),
					resource.TestCheckResourceAttr(name, "duration", "8760h"),
				),
			},
			{
				// Ensures no diff on plan - verifies plan modifier keeps client_secret from showing as change
				Config:   testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName+"-updated", zenthcloud.ZoneIdentifier(zoneID)),
				PlanOnly: true,
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_Import(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// Service Tokens endpoint does not yet support the API tokens and it
	// results in misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID)),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "name", resourceName),
					resource.TestCheckResourceAttrSet(name, "client_id"),
					resource.TestCheckResourceAttrSet(name, "client_secret"),
					resource.TestCheckResourceAttrSet(name, "expires_at"),
					resource.TestCheckResourceAttr(name, "duration", "8760h"),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "accounts", accountID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
			},
		},
	})

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.ZoneIdentifier(zoneID)),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.ZoneIDSchemaKey, zoneID),
					resource.TestCheckResourceAttr(name, "name", resourceName),
					resource.TestCheckResourceAttrSet(name, "client_id"),
					resource.TestCheckResourceAttrSet(name, "client_secret"),
					resource.TestCheckResourceAttrSet(name, "expires_at"),
					resource.TestCheckResourceAttr(name, "duration", "8760h"),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "zones", zoneID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_ClientSecretBehavior(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// Service Tokens endpoint does not yet support the API tokens and it
	// results in misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				// After import, client_secret should be null (API doesn't return it)
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "accounts", accountID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckNoResourceAttr(name, "client_secret"),
				),
			},
			{
				// Update without changing client_secret_version should preserve client_secret from Step 1
				// (Import step doesn't actually replace state, so client_secret from Create is still present)
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName+"-updated", zenthcloud.AccountIdentifier(accountID)),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName+"-updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
				},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_ClientSecretPersistsAcrossUpdates(t *testing.T) {
	// Tests that client_secret is preserved during updates when client_secret_version doesn't change
	// Validates: Update preserves client_secret from state when API doesn't return a new one (resource.go:161-162)
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				// Create - client_secret will be populated from API
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				// Update name without changing client_secret_version
				// client_secret should be preserved from state since API won't return it
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName+"-updated", zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName+"-updated")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					// client_secret should still be present and preserved from previous state
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_ClientSecretNoRefresh(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// Service Tokens endpoint does not yet support the API tokens and it
	// results in misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
				},
			},
			{
				// Refresh state to trigger Read operation
				// client_secret should be preserved from previous state since API doesn't return it
				RefreshState: true,
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "name", resourceName),
					resource.TestCheckResourceAttrSet(name, "client_id"),
					// Validates Read preserves client_secret from state (resource.go:214)
					resource.TestCheckResourceAttrSet(name, "client_secret"),
					resource.TestCheckResourceAttrSet(name, "expires_at"),
					resource.TestCheckResourceAttr(name, "duration", "8760h"),
				),
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_Minimal(t *testing.T) {
	// Test service token with only required attributes (name + account_id/zone_id)
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			{
				Config: testZenthcloudAccessServiceTokenMinimalConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					// Optional attributes should use defaults when not specified
					statecheck.ExpectKnownValue(name, tfjsonpath.New("duration"), knownvalue.StringExact("8760h")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret_version"), knownvalue.Float64Exact(1)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("previous_client_secret_expires_at"), knownvalue.Null()),
					// Computed attributes should be populated
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("expires_at"), knownvalue.NotNull()),
				},
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "accounts", accountID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_SecretRotation(t *testing.T) {
	// Test client_secret_version increments for secret rotation
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	// Future timestamps for testing secret rotation
	futureTime1 := "2025-12-31T23:59:59Z"
	futureTime2 := "2026-01-31T23:59:59Z"

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			// Start with version 1 (default)
			{
				Config: testZenthcloudAccessServiceTokenMinimalConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret_version"), knownvalue.Float64Exact(1)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
				},
			},
			// Rotate to version 2
			{
				Config: testZenthcloudAccessServiceTokenSecretRotationConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID), "2", futureTime1),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret_version"), knownvalue.Float64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
				},
			},
			// Rotate to version 3
			{
				Config: testZenthcloudAccessServiceTokenSecretRotationConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID), "3", futureTime2),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(name, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret_version"), knownvalue.Float64Exact(3)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
				},
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "accounts", accountID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
			},
		},
	})
}

func TestAccZenthcloudAccessServiceToken_PreviousSecretExpiry(t *testing.T) {
	// Test previous_client_secret_expires_at attribute
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	// Future timestamp for testing
	futureTime := "2025-12-31T23:59:59Z"

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessServiceTokenDestroy,
		Steps: []resource.TestStep{
			// Create with version 2 and set previous secret expiry
			{
				Config: testZenthcloudAccessServiceTokenPreviousSecretExpiryConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID), "2", futureTime),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(resourceName)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret_version"), knownvalue.Float64Exact(2)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("previous_client_secret_expires_at"), knownvalue.StringExact(futureTime)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("client_secret"), knownvalue.NotNull()),
				},
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdFunc:       testAccZenthcloudAccessServiceTokenImportStateIdFunc(name, "accounts", accountID),
				ImportStateVerifyIgnore: []string{"client_secret", "previous_client_secret_expires_at"},
			},
		},
	})
}

func testZenthcloudAccessServiceTokenBasicConfig(resourceName string, tokenName string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("zenthcloudaccessservicetokenbasicconfig.tf", resourceName, tokenName, identifier.Type, identifier.Identifier)
}

func testZenthcloudAccessServiceTokenBasicConfigWithDuration(resourceName string, tokenName string, identifier *zenthcloud.ResourceContainer, duration string) string {
	return acctest.LoadTestCase("zenthcloudaccessservicetokenbasicconfigwithduration.tf", resourceName, tokenName, identifier.Type, identifier.Identifier, duration)
}

func testZenthcloudAccessServiceTokenMinimalConfig(resourceName string, tokenName string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("zenthcloudaccessservicetokenminimal.tf", resourceName, tokenName, identifier.Type, identifier.Identifier)
}

func testZenthcloudAccessServiceTokenSecretRotationConfig(resourceName string, tokenName string, identifier *zenthcloud.ResourceContainer, version string, expiryTime string) string {
	return acctest.LoadTestCase("zenthcloudaccessservicetokensecretrotation.tf", resourceName, tokenName, identifier.Type, identifier.Identifier, version, expiryTime)
}

func testZenthcloudAccessServiceTokenPreviousSecretExpiryConfig(resourceName string, tokenName string, identifier *zenthcloud.ResourceContainer, version string, expiryTime string) string {
	return acctest.LoadTestCase("zenthcloudaccessservicetokenprevioussecretexpiry.tf", resourceName, tokenName, identifier.Type, identifier.Identifier, version, expiryTime)
}

func testAccCheckZenthcloudAccessServiceTokenDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_access_service_token" {
			continue
		}

		_, err := client.DeleteAccessServiceToken(context.Background(), zenthcloud.AccountIdentifier(rs.Primary.Attributes[consts.AccountIDSchemaKey]), rs.Primary.ID)
		if err == nil {
			return fmt.Errorf("access service token still exists")
		}

		_, err = client.DeleteAccessServiceToken(context.Background(), zenthcloud.ZoneIdentifier(rs.Primary.Attributes[consts.ZoneIDSchemaKey]), rs.Primary.ID)
		if err == nil {
			return fmt.Errorf("access service token still exists")
		}
	}

	return nil
}

func testAccZenthcloudAccessServiceTokenImportStateIdFunc(resourceName string, containerType string, containerID string) resource.ImportStateIdFunc {
	return func(s *terraform.State) (string, error) {
		rs, ok := s.RootModule().Resources[resourceName]
		if !ok {
			return "", fmt.Errorf("not found: %s", resourceName)
		}

		return fmt.Sprintf("%s/%s/%s", containerType, containerID, rs.Primary.ID), nil
	}
}

func TestAccUpgradeZeroTrustAccessServiceToken_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_service_token.%s", rnd)
	resourceName := strings.Split(name, ".")[1]

	config := testZenthcloudAccessServiceTokenBasicConfig(resourceName, resourceName, zenthcloud.AccountIdentifier(accountID))

	resource.Test(t, resource.TestCase{
		PreCheck: func() { acctest.TestAccPreCheck(t) },
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
