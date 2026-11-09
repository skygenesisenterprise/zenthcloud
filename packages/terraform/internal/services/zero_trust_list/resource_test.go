package zero_trust_list_test

import (
	"context"
	"fmt"
	"os"
	"strconv"
	"strings"
	"testing"

	"github.com/zenthcloud/zenthcloud-go"
	cfv6 "github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-log/tflog"
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
	resource.AddTestSweepers("zenthcloud_zero_trust_list", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_list",
		F:    testSweepZenthcloudZeroTrustList,
	})
}

func testSweepZenthcloudZeroTrustList(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	
	if accountID == "" {
		return nil
	}
	
	// List all zero trust lists
	page, err := client.ZeroTrust.Gateway.Lists.List(ctx, zero_trust.GatewayListListParams{
		AccountID: cfv6.F(accountID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch zero trust lists: %s", err))
		return err
	}
	if len(page.Result) == 0 {
		tflog.Info(ctx, "No Zenthcloud zero trust lists to sweep")
		return nil
	}

	for _, list := range page.Result {
		if !utils.ShouldSweepResource(list.Name) {
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleting zero trust list: %s (%s)", list.Name, list.ID))
		_, err := client.ZeroTrust.Gateway.Lists.Delete(ctx, list.ID, zero_trust.GatewayListDeleteParams{
			AccountID: cfv6.F(accountID),
		})
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete zero trust list %s (%s): %s", list.Name, list.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted zero trust list: %s (%s)", list.Name, list.ID))
	}

	return nil
}

func TestAccZenthcloudTeamsList_Basic(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsListConfigBasic(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("SERIAL")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("My description")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"description": knownvalue.Null(),
							"value":       knownvalue.StringExact("asdf-1234"),
						}),
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"description": knownvalue.Null(),
							"value":       knownvalue.StringExact("asdf-5678"),
						}),
					})),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count"},
			},
		},
	})
}

func TestAccZenthcloudTeamsList_LottaListItems(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsListConfigBigItemCount(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("SERIAL")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("My description")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.ListSizeExact(1000)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count"},
			},
		},
	})
}

func TestAccZenthcloudTeamsList_Reordered(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsListConfigBasic(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"description": knownvalue.Null(),
							"value":       knownvalue.StringExact("asdf-1234"),
						}),
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"description": knownvalue.Null(),
							"value":       knownvalue.StringExact("asdf-5678"),
						}),
					})),
				},
			},
			{
				Config: testAccZenthcloudTeamsListConfigReorderedItems(rnd, accountID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionNoop),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.ListExact([]knownvalue.Check{
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"description": knownvalue.Null(),
							"value":       knownvalue.StringExact("asdf-1234"),
						}),
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"description": knownvalue.Null(),
							"value":       knownvalue.StringExact("asdf-5678"),
						}),
					})),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count"},
			},
		},
	})
}

func TestAccZenthcloudTeamsList_Update(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsListConfigReorderedItems(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, "description", "My description"),
					resource.TestCheckResourceAttr(resourceName, "type", "SERIAL"),
					resource.TestCheckResourceAttr(resourceName, "items.#", "2"),
					resource.TestCheckResourceAttr(resourceName, "items.0.value", "asdf-1234"),
					resource.TestCheckResourceAttr(resourceName, "items.1.value", "asdf-5678"),
				),
			},
			{
				Config: testAccZenthcloudTeamsListConfigReorderedItemsUpdate(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(resourceName, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(resourceName, "name", rnd),
					resource.TestCheckResourceAttr(resourceName, "description", "My description update"),
					resource.TestCheckResourceAttr(resourceName, "type", "SERIAL"),
					resource.TestCheckResourceAttr(resourceName, "items.#", "3"),
					resource.TestCheckResourceAttr(resourceName, "items.0.value", "asdf-1234"),
					resource.TestCheckResourceAttr(resourceName, "items.1.value", "bsdf-5678"),
					resource.TestCheckResourceAttr(resourceName, "items.2.value", "csdf-5678"),
				),
			},

			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count"},
			},
		},
	})
}

func TestAccZenthcloudTeamsList_DomainType(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsListConfigDomain(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("DOMAIN")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("Domain list for testing")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.SetSizeExact(3)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count"},
			},
		},
	})
}

func TestAccZenthcloudTeamsList_URLType(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsListConfigURL(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("URL")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("URL list for testing")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.SetSizeExact(3)),
				},
				ExpectNonEmptyPlan: true, // URL normalization by API can cause plan drift
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count", "items", "created_at", "updated_at"},
			},
		},
	})
}

func TestAccZenthcloudTeamsList_EmailType(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsListConfigEmail(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("EMAIL")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("Email list for testing")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.SetSizeExact(3)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count"},
			},
		},
	})
}

func TestAccZenthcloudTeamsList_IPType(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsListConfigIP(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("IP")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("IP list for testing")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.SetSizeExact(3)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count"},
			},
		},
	})
}

func TestAccZenthcloudTeamsList_EmptyList(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudTeamsListConfigEmpty(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("DOMAIN")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("Empty list for testing")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.Null()),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count"},
			},
		},
	})
}

func TestAccZenthcloudTeamsList_ItemLifecycle(t *testing.T) {
	// Temporarily unset ZENTHCLOUD_API_TOKEN if it is set as the Access
	// service does not yet support the API tokens and it results in
	// misleading state error messages.
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			// Start with DOMAIN list
			{
				Config: testAccZenthcloudTeamsListConfigDomain(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("DOMAIN")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("Domain list for testing")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.SetSizeExact(3)),
				},
			},
			// Update items and descriptions
			{
				Config: testAccZenthcloudTeamsListConfigUpdatedItems(rnd, accountID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("DOMAIN")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("Updated list for testing")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.SetSizeExact(2)),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count", "items", "created_at", "updated_at"},
			},
		},
	})
}

func TestAccZenthcloudTeamsList_DescriptionUpdates(t *testing.T) {
	// Test for issue #4119: zenthcloud_teams_list not updating items_with_description
	// Validates that item descriptions can be added, updated, and removed correctly
	if os.Getenv("ZENTHCLOUD_API_TOKEN") != "" {
		t.Setenv("ZENTHCLOUD_API_TOKEN", "")
	}

	rnd := utils.GenerateRandomResourceName()
	resourceName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudTeamsListDestroy,
		Steps: []resource.TestStep{
			// Step 1: Create list with mixed items (some with descriptions, some without)
			{
				Config: testAccZenthcloudTeamsListConfigDescUpdate1(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("SERIAL")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("Testing description updates")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.SetExact([]knownvalue.Check{
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"value":       knownvalue.StringExact("device-001"),
							"description": knownvalue.Null(),
						}),
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"value":       knownvalue.StringExact("device-002"),
							"description": knownvalue.StringExact("Original description"),
						}),
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"value":       knownvalue.StringExact("device-003"),
							"description": knownvalue.StringExact("Will be updated"),
						}),
					})),
				},
			},
			// Step 2: Update descriptions - add, modify, remove, and add new item
			{
				Config: testAccZenthcloudTeamsListConfigDescUpdate2(rnd, accountID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectResourceAction(resourceName, plancheck.ResourceActionUpdate),
					},
				},
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("type"), knownvalue.StringExact("SERIAL")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("description"), knownvalue.StringExact("Testing description updates")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("items"), knownvalue.SetExact([]knownvalue.Check{
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"value":       knownvalue.StringExact("device-001"),
							"description": knownvalue.StringExact("Added description"), // Added description
						}),
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"value":       knownvalue.StringExact("device-002"),
							"description": knownvalue.Null(), // Removed description
						}),
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"value":       knownvalue.StringExact("device-003"),
							"description": knownvalue.StringExact("Updated description"), // Modified description
						}),
						knownvalue.ObjectExact(map[string]knownvalue.Check{
							"value":       knownvalue.StringExact("device-004"),
							"description": knownvalue.StringExact("New item with description"), // New item
						}),
					})),
				},
			},
			{
				ResourceName:            resourceName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", accountID),
				ImportStateVerifyIgnore: []string{"list_count", "created_at", "updated_at"},
			},
		},
	})
}

func testAccZenthcloudTeamsListConfigBasic(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigbasic.tf", rnd, accountID)
}

func testAccZenthcloudTeamsListConfigBigItemCount(rnd, accountID string) string {
	items := []string{}
	for i := 0; i < 1000; i++ {
		items = append(items, `{value = "example-`+strconv.Itoa(i)+`"}`)
	}

	return acctest.LoadTestCase("teamslistconfigbigitemcount.tf", rnd, accountID, strings.Join(items, ","))
}

func testAccZenthcloudTeamsListConfigReorderedItems(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigreordereditems.tf", rnd, accountID)
}

func testAccZenthcloudTeamsListConfigReorderedItemsUpdate(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigreordereditems-update.tf", rnd, accountID)
}

func testAccCheckZenthcloudTeamsListDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		return fmt.Errorf("failed to create Zenthcloud client: %s", clientErr)
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_list" {
			continue
		}

		identifier := zenthcloud.AccountIdentifier(rs.Primary.Attributes[consts.AccountIDSchemaKey])
		_, err := client.GetTeamsList(context.Background(), identifier, rs.Primary.ID)
		if err == nil {
			return fmt.Errorf("Teams List still exists")
		}
	}

	return nil
}

func testAccZenthcloudTeamsListConfigDomain(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigdomain.tf", rnd, accountID)
}

func testAccZenthcloudTeamsListConfigURL(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigurl.tf", rnd, accountID)
}

func testAccZenthcloudTeamsListConfigEmail(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigemail.tf", rnd, accountID)
}

func testAccZenthcloudTeamsListConfigIP(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigip.tf", rnd, accountID)
}

func testAccZenthcloudTeamsListConfigEmpty(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigempty.tf", rnd, accountID)
}

func testAccZenthcloudTeamsListConfigUpdatedItems(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigupdateditems.tf", rnd, accountID)
}

func testAccZenthcloudTeamsListConfigDescUpdate1(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigdescupdate1.tf", rnd, accountID)
}

func testAccZenthcloudTeamsListConfigDescUpdate2(rnd, accountID string) string {
	return acctest.LoadTestCase("teamslistconfigdescupdate2.tf", rnd, accountID)
}

func TestAccUpgradeZeroTrustList_FromPublishedV5(t *testing.T) {
	t.Skip("Failed to marshal state to json: schema version 0 in state does not match version 1 from the provider")
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	config := testAccZenthcloudTeamsListConfigBasic(rnd, accountID)

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
