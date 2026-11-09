package zero_trust_access_group_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	zenthcloud "github.com/zenthcloud/zenthcloud-go"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_zero_trust_access_group", &resource.Sweeper{
		Name: "zenthcloud_zero_trust_access_group",
		F:    testSweepZenthcloudAccessGroups,
	})
}

func testSweepZenthcloudAccessGroups(r string) error {
	ctx := context.Background()

	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	// Zone level Access Groups
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	if zoneID == "" {
		tflog.Info(ctx, "Skipping zone-level Access Groups sweep: ZENTHCLOUD_ZONE_ID not set")
		zoneID = "skip" // Use placeholder to skip zone sweep
	}
	zoneAccessGroups, _, err := client.ListAccessGroups(context.Background(), zenthcloud.ZoneIdentifier(zoneID), zenthcloud.ListAccessGroupsParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch zone level Access Groups: %s", err))
	}

	if len(zoneAccessGroups) == 0 {
		tflog.Info(ctx, "No Zenthcloud zone level Access Groups to sweep")
	}

	for _, accessGroup := range zoneAccessGroups {
		// Use standard filtering helper
		if !utils.ShouldSweepResource(accessGroup.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting zone-level Access Group: %s (%s)", accessGroup.Name, accessGroup.ID))
		if err := client.DeleteAccessGroup(context.Background(), zenthcloud.ZoneIdentifier(zoneID), accessGroup.ID); err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete zone-level Access Group %s (%s): %s", accessGroup.Name, accessGroup.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted zone-level Access Group: %s (%s)", accessGroup.Name, accessGroup.ID))
	}

	// Account level Access Groups
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping account-level Access Groups sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}
	accountAccessGroups, _, err := client.ListAccessGroups(context.Background(), zenthcloud.AccountIdentifier(accountID), zenthcloud.ListAccessGroupsParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch account level Access Groups: %s", err))
	}

	if len(accountAccessGroups) == 0 {
		tflog.Info(ctx, "No Zenthcloud account level Access Groups to sweep")
		return nil
	}

	for _, accessGroup := range accountAccessGroups {
		// Use standard filtering helper
		if !utils.ShouldSweepResource(accessGroup.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting account-level Access Group: %s (%s)", accessGroup.Name, accessGroup.ID))
		if err := client.DeleteAccessGroup(context.Background(), zenthcloud.AccountIdentifier(accountID), accessGroup.ID); err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete account-level Access Group %s (%s): %s", accessGroup.Name, accessGroup.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted account-level Access Group: %s (%s)", accessGroup.Name, accessGroup.ID))
	}

	return nil
}

var (
	zoneID      = os.Getenv("ZENTHCLOUD_ZONE_ID")
	accountID   = os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	email       = "test@example.com"
	accessGroup zenthcloud.AccessGroup
)

func TestAccZenthcloudAccessGroup_ConfigBasicAccount(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigBasic(rnd, email, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact(email)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(2).AtMapKey("email_domain").AtMapKey("domain"), knownvalue.StringExact("example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(3).AtMapKey("ip").AtMapKey("ip"), knownvalue.StringExact("192.0.2.1/32")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(4).AtMapKey("ip_list").AtMapKey("id"), knownvalue.StringExact("e3a0f205-c525-4e48-a293-ba5d1f00e638")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(5).AtMapKey("saml").AtMapKey("attribute_name"), knownvalue.StringExact("Name1")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(5).AtMapKey("saml").AtMapKey("attribute_value"), knownvalue.StringExact("Value1")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(5).AtMapKey("saml").AtMapKey("identity_provider_id"), knownvalue.StringExact("1234")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(6).AtMapKey("azure_ad").AtMapKey("id"), knownvalue.StringExact("group1")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(6).AtMapKey("azure_ad").AtMapKey("identity_provider_id"), knownvalue.StringExact("1234")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(7).AtMapKey("ip").AtMapKey("ip"), knownvalue.StringExact("192.0.2.2/32")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(8).AtMapKey("ip_list").AtMapKey("id"), knownvalue.StringExact("5d54cd30-ce52-46e4-9a46-a47887e1a167")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(9).AtMapKey("saml").AtMapKey("attribute_name"), knownvalue.StringExact("Name2")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(9).AtMapKey("saml").AtMapKey("attribute_value"), knownvalue.StringExact("Value2")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(9).AtMapKey("saml").AtMapKey("identity_provider_id"), knownvalue.StringExact("1234")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(10).AtMapKey("azure_ad").AtMapKey("id"), knownvalue.StringExact("group2")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(10).AtMapKey("azure_ad").AtMapKey("identity_provider_id"), knownvalue.StringExact("5678")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_ConfigBasicZone(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigBasic(rnd, email, zenthcloud.ZoneIdentifier(zoneID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.ZoneIDSchemaKey), knownvalue.StringExact(zoneID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact(email)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(2).AtMapKey("email_domain").AtMapKey("domain"), knownvalue.StringExact("example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(3).AtMapKey("ip").AtMapKey("ip"), knownvalue.StringExact("192.0.2.1/32")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(4).AtMapKey("ip_list").AtMapKey("id"), knownvalue.StringExact("e3a0f205-c525-4e48-a293-ba5d1f00e638")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(5).AtMapKey("saml").AtMapKey("attribute_name"), knownvalue.StringExact("Name1")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(5).AtMapKey("saml").AtMapKey("attribute_value"), knownvalue.StringExact("Value1")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(5).AtMapKey("saml").AtMapKey("identity_provider_id"), knownvalue.StringExact("1234")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(6).AtMapKey("azure_ad").AtMapKey("id"), knownvalue.StringExact("group1")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(6).AtMapKey("azure_ad").AtMapKey("identity_provider_id"), knownvalue.StringExact("1234")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(7).AtMapKey("ip").AtMapKey("ip"), knownvalue.StringExact("192.0.2.2/32")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(8).AtMapKey("ip_list").AtMapKey("id"), knownvalue.StringExact("5d54cd30-ce52-46e4-9a46-a47887e1a167")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(9).AtMapKey("saml").AtMapKey("attribute_name"), knownvalue.StringExact("Name2")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(9).AtMapKey("saml").AtMapKey("attribute_value"), knownvalue.StringExact("Value2")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(9).AtMapKey("saml").AtMapKey("identity_provider_id"), knownvalue.StringExact("1234")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(10).AtMapKey("azure_ad").AtMapKey("id"), knownvalue.StringExact("group2")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(10).AtMapKey("azure_ad").AtMapKey("identity_provider_id"), knownvalue.StringExact("5678")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.ZoneIdentifier(zoneID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("zones/%s/", zoneID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_ConfigEmailList(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	rnd2 := utils.GenerateRandomResourceName()
	emailListName := fmt.Sprintf("zenthcloud_zero_trust_list.%s", rnd2)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigEmailList(rnd, rnd2, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(emailListName, tfjsonpath.New("name"), knownvalue.StringExact(rnd2)),
					statecheck.ExpectKnownValue(emailListName, tfjsonpath.New("type"), knownvalue.StringExact("EMAIL")),
					statecheck.ExpectKnownValue(emailListName, tfjsonpath.New("items").AtSliceIndex(0).AtMapKey("value"), knownvalue.StringExact("test@example.com")),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_Exclude(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccessGroupConfigExclude(rnd, accountID, email),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact(email)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("email_domain").AtMapKey("domain"), knownvalue.StringExact("example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact(email)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_Require(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccessGroupConfigRequire(rnd, accountID, email),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact(email)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("email_domain").AtMapKey("domain"), knownvalue.StringExact("example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact(email)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_FullConfig(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccessGroupConfigFullConfig(rnd, accountID, email),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact(email)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("email_domain").AtMapKey("domain"), knownvalue.StringExact("example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(2).AtMapKey("common_name").AtMapKey("common_name"), knownvalue.StringExact("common")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(3).AtMapKey("common_name").AtMapKey("common_name"), knownvalue.StringExact("name")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact(email)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact(email)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_WithIDP(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	groupName := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)
	githubOrg := "Terraform-Zenthcloud-Provider-Test-Org"
	team := "test-team-1"

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupWithIDPDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupWithIDP(accountID, rnd, githubOrg, team),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("github_organization").AtMapKey("name"), knownvalue.StringExact(githubOrg)),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("github_organization").AtMapKey("team"), knownvalue.StringExact(team)),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("exclude"), knownvalue.Null()),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("require"), knownvalue.Null()),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("is_default"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(groupName, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            groupName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_WithIDPAuthContext(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	groupName := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)
	ctxID := utils.GenerateRandomResourceName()
	ctxACID := "c1"

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupWithIDPAuthContext(accountID, rnd, ctxID, ctxACID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("require").AtSliceIndex(0).AtMapKey("auth_context").AtMapKey("id"), knownvalue.StringExact(ctxID)),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("require").AtSliceIndex(0).AtMapKey("auth_context").AtMapKey("ac_id"), knownvalue.StringExact(ctxACID)),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("exclude"), knownvalue.Null()),
					statecheck.ExpectKnownValue(groupName, tfjsonpath.New("is_default"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(groupName, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            groupName,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_Updated(t *testing.T) {
	var before, after zenthcloud.AccessGroup
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigBasic(rnd, email, zenthcloud.AccountIdentifier(accountID)),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &before),
				),
			},
			{
				Config: testAccZenthcloudAccessGroupConfigBasic(rnd, "test-changed@example.com", zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact("test-changed@example.com")),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &after),
					testAccCheckZenthcloudAccessGroupIDUnchanged(&before, &after),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_UpdatedFromCommonNameToCommonNames(t *testing.T) {
	var before, after zenthcloud.AccessGroup
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigBasicWithCommonName(rnd, zenthcloud.AccountIdentifier(accountID)),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &before),
				),
			},
			{
				Config: testAccZenthcloudAccessGroupConfigBasicWithCommonNames(rnd, zenthcloud.AccountIdentifier(accountID)),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("common_name").AtMapKey("common_name"), knownvalue.StringExact("common")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("common_name").AtMapKey("common_name"), knownvalue.StringExact("name")),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &after),
					testAccCheckZenthcloudAccessGroupIDUnchanged(&before, &after),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func testAccZenthcloudAccessGroupConfigBasic(resourceName string, email string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("accessgroupconfigbasic.tf", resourceName, email, identifier.Type, identifier.Identifier)
}

func testAccZenthcloudAccessGroupConfigBasicWithUpdate(resourceName, accountID, email string) string {
	return acctest.LoadTestCase("accessgroupconfigbasicwithupdate.tf", resourceName, accountID, email)
}

func testAccessGroupConfigExclude(resourceName, accountID, email string) string {
	return acctest.LoadTestCase("accessgroupconfigexclude.tf", resourceName, accountID, email)
}

func testAccessGroupConfigRequire(resourceName, accountID, email string) string {
	return acctest.LoadTestCase("accessgroupconfigrequire.tf", resourceName, accountID, email)
}

func testAccessGroupConfigFullConfig(resourceName, accountID, email string) string {
	return acctest.LoadTestCase("accessgroupconfigfullconfig.tf", resourceName, accountID, email)
}

func testAccZenthcloudAccessGroupWithIDP(accountID, rnd, githubOrg, team string) string {
	return acctest.LoadTestCase("accessgroupwithidp.tf", accountID, rnd, githubOrg, team)
}

func testAccZenthcloudAccessGroupWithIDPAuthContext(accountID, rnd, authCtxID, authCtxACID string) string {
	return acctest.LoadTestCase("accessgroupwithidpauthcontext.tf", accountID, rnd, authCtxID, authCtxACID)
}

func testAccZenthcloudAccessGroupConfigBasicWithCommonName(resourceName string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("accessgroupconfigbasicwithcommonname.tf", resourceName, identifier.Type, identifier.Identifier)
}

func testAccZenthcloudAccessGroupConfigBasicWithCommonNames(resourceName string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("accessgroupconfigbasicwithcommonnames.tf", resourceName, identifier.Type, identifier.Identifier)
}

func testAccZenthcloudAccessGroupConfigEmailList(resourceName string, emailListName string, identifier *zenthcloud.ResourceContainer) string {
	return acctest.LoadTestCase("accessgroupconfigemaillist.tf", resourceName, emailListName, identifier.Type, identifier.Identifier)
}

func testAccZenthcloudAccessGroupConfigMinimal(resourceName, accountID string) string {
	return acctest.LoadTestCase("accessgroupconfigminimal.tf", resourceName, accountID)
}

func testAccZenthcloudAccessGroupConfigUpdateRuleTypes(resourceName, accountID string) string {
	return acctest.LoadTestCase("accessgroupconfigupdateruletypes.tf", resourceName, accountID)
}

func testAccZenthcloudAccessGroupConfigWithIsDefault(resourceName, accountID string, isDefault bool) string {
	return acctest.LoadTestCase("accessgroupconfigwithisdefault.tf", resourceName, accountID, isDefault)
}

func testAccZenthcloudAccessGroupConfigComplexRules(resourceName, accountID string) string {
	return acctest.LoadTestCase("accessgroupconfigcomplexrules.tf", resourceName, accountID)
}

func testAccZenthcloudAccessGroupConfigAllRuleTypes(resourceName, accountID string) string {
	return acctest.LoadTestCase("accessgroupconfigallruletypes.tf", resourceName, accountID)
}

func testAccZenthcloudAccessGroupConfigServiceTokens(resourceName, accountID string) string {
	return acctest.LoadTestCase("accessgroupconfigservicetokens.tf", resourceName, accountID)
}

func testAccZenthcloudAccessGroupConfigLoginMethod(resourceName, accountID string) string {
	return acctest.LoadTestCase("accessgroupconfigloginmethod.tf", resourceName, accountID)
}

func testAccCheckZenthcloudAccessGroupExists(n string, accessIdentifier *zenthcloud.ResourceContainer, accessGroup *zenthcloud.AccessGroup) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("not found: %s", n)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No AccessGroup ID is set")
		}

		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}
		var foundAccessGroup zenthcloud.AccessGroup
		var err error

		if accessIdentifier.Level == zenthcloud.AccountRouteLevel {
			foundAccessGroup, err = client.GetAccessGroup(context.Background(), zenthcloud.AccountIdentifier(rs.Primary.Attributes[consts.AccountIDSchemaKey]), rs.Primary.ID)
			if err != nil {
				return err
			}
		} else {
			foundAccessGroup, err = client.GetAccessGroup(context.Background(), zenthcloud.ZoneIdentifier(rs.Primary.Attributes[consts.ZoneIDSchemaKey]), rs.Primary.ID)
			if err != nil {
				return err
			}
		}

		if foundAccessGroup.ID != rs.Primary.ID {
			return fmt.Errorf("AccessGroup not found")
		}

		*accessGroup = foundAccessGroup

		return nil
	}
}

func testAccCheckZenthcloudAccessGroupDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_zero_trust_access_group" {
			continue
		}

		_, err := client.GetAccessGroup(context.Background(), zenthcloud.AccountIdentifier(rs.Primary.Attributes[consts.AccountIDSchemaKey]), rs.Primary.ID)
		if err == nil {
			return fmt.Errorf("AccessGroup still exists")
		}

		_, err = client.GetAccessGroup(context.Background(), zenthcloud.ZoneIdentifier(rs.Primary.Attributes[consts.ZoneIDSchemaKey]), rs.Primary.ID)
		if err == nil {
			return fmt.Errorf("AccessGroup still exists")
		}
	}

	return nil
}

func testAccCheckZenthcloudAccessGroupWithIDPDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		switch rs.Type {
		case "zenthcloud_zero_trust_access_group":
			// Check access group is destroyed
			_, err := client.GetAccessGroup(context.Background(), zenthcloud.AccountIdentifier(rs.Primary.Attributes[consts.AccountIDSchemaKey]), rs.Primary.ID)
			if err == nil {
				return fmt.Errorf("AccessGroup still exists")
			}

			_, err = client.GetAccessGroup(context.Background(), zenthcloud.ZoneIdentifier(rs.Primary.Attributes[consts.ZoneIDSchemaKey]), rs.Primary.ID)
			if err == nil {
				return fmt.Errorf("AccessGroup still exists")
			}

		case "zenthcloud_zero_trust_access_identity_provider":
			// Check identity provider is destroyed - but be resilient to API errors
			_, err := client.GetAccessIdentityProvider(context.Background(), zenthcloud.AccountIdentifier(rs.Primary.Attributes[consts.AccountIDSchemaKey]), rs.Primary.ID)
			if err == nil {
				return fmt.Errorf("AccessIdentityProvider still exists")
			}
			// Ignore 500 errors during cleanup as they're often transient API issues
			// The resource will be cleaned up eventually by sweepers if needed
		}
	}

	return nil
}

func testAccCheckZenthcloudAccessGroupIDUnchanged(before, after *zenthcloud.AccessGroup) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		if before.ID != after.ID {
			return fmt.Errorf("ID should not change suring in place update, but got change %s -> %s", before.ID, after.ID)
		}
		return nil
	}
}

func testAccManuallyDeleteAccessGroup(name string, initialID *string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[name]
		if !ok {
			return fmt.Errorf("not found: %s", name)
		}

		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}
		*initialID = rs.Primary.ID
		err := client.DeleteAccessGroup(context.Background(), zenthcloud.AccountIdentifier(rs.Primary.Attributes[consts.AccountIDSchemaKey]), rs.Primary.ID)
		if err != nil {
			return err
		}
		return nil
	}
}

func testAccCheckZenthcloudAccessGroupRecreated(before, after *zenthcloud.AccessGroup) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		if before.ID == after.ID {
			return fmt.Errorf("expected change of AccessGroup Ids, but both were %v", before.ID)
		}
		return nil
	}
}

func TestAccZenthcloudAccessGroup_MinimalConfiguration(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigMinimal(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("everyone"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_MultipleIncludeRuleTypes(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigUpdateRuleTypes(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact("test@example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("everyone"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_IsDefaultAttribute(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigWithIsDefault(rnd, accountID, true),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default"), knownvalue.Bool(true)),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				Config: testAccZenthcloudAccessGroupConfigWithIsDefault(rnd, accountID, false),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default"), knownvalue.Bool(false)),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_ComplexRuleCombinations(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigComplexRules(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact("include@example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("ip").AtMapKey("ip"), knownvalue.StringExact("10.0.0.0/8")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact("exclude@example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require").AtSliceIndex(0).AtMapKey("email_domain").AtMapKey("domain"), knownvalue.StringExact("company.com")),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_UpdateOptionalAttributes(t *testing.T) {
	var before, after zenthcloud.AccessGroup
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigMinimal(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("is_default"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &before),
				),
			},
			{
				Config: testAccZenthcloudAccessGroupConfigComplexRules(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact("exclude@example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require").AtSliceIndex(0).AtMapKey("email_domain").AtMapKey("domain"), knownvalue.StringExact("company.com")),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &after),
					testAccCheckZenthcloudAccessGroupIDUnchanged(&before, &after),
				),
			},
			{
				Config: testAccZenthcloudAccessGroupConfigMinimal(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require"), knownvalue.Null()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &after),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_AllRuleTypes(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigAllRuleTypes(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact("test@example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude").AtSliceIndex(0).AtMapKey("geo").AtMapKey("country_code"), knownvalue.StringExact("CN")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude").AtSliceIndex(1).AtMapKey("device_posture").AtMapKey("integration_uid"), knownvalue.StringExact("test-device-posture-uid")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude").AtSliceIndex(2).AtMapKey("external_evaluation").AtMapKey("evaluate_url"), knownvalue.StringExact("https://example.com/evaluate")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude").AtSliceIndex(2).AtMapKey("external_evaluation").AtMapKey("keys_url"), knownvalue.StringExact("https://example.com/keys")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require").AtSliceIndex(0).AtMapKey("auth_method").AtMapKey("auth_method"), knownvalue.StringExact("hwk")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require").AtSliceIndex(1).AtMapKey("certificate"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require").AtSliceIndex(2).AtMapKey("any_valid_service_token"), knownvalue.NotNull()),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_MultipleRuleTypesWithGeo(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigServiceTokens(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact("test@example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("everyone"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude").AtSliceIndex(0).AtMapKey("geo").AtMapKey("country_code"), knownvalue.StringExact("RU")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require").AtSliceIndex(0).AtMapKey("auth_method").AtMapKey("auth_method"), knownvalue.StringExact("swk")),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_IPRangeRules(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigLoginMethod(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(0).AtMapKey("email").AtMapKey("email"), knownvalue.StringExact("test@example.com")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("include").AtSliceIndex(1).AtMapKey("ip").AtMapKey("ip"), knownvalue.StringExact("192.0.2.0/24")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude").AtSliceIndex(0).AtMapKey("ip").AtMapKey("ip"), knownvalue.StringExact("192.0.2.100/32")),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require").AtSliceIndex(0).AtMapKey("email_domain").AtMapKey("domain"), knownvalue.StringExact("company.com")),
				},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
		},
	})
}

func TestAccZenthcloudAccessGroup_ImportEmptyArrayToNull(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_zero_trust_access_group.%s", rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudAccessGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudAccessGroupConfigMinimal(rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudAccessGroupExists(name, zenthcloud.AccountIdentifier(accountID), &accessGroup),
				),
			},
			{
				ResourceName:            name,
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"is_default"},
				ImportStateIdPrefix:     fmt.Sprintf("accounts/%s/", accountID),
			},
			{
				Config: testAccZenthcloudAccessGroupConfigMinimal(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(name, tfjsonpath.New("require"), knownvalue.Null()),
					statecheck.ExpectKnownValue(name, tfjsonpath.New("exclude"), knownvalue.Null()),
				},
			},
			{
				Config:   testAccZenthcloudAccessGroupConfigMinimal(rnd, accountID),
				PlanOnly: true,
			},
		},
	})
}

func TestAccUpgradeZeroTrustAccessGroup_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()

	config := testAccZenthcloudAccessGroupConfigBasic(rnd, email, zenthcloud.AccountIdentifier(accountID))

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
