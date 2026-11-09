package user_group_test

import (
	"context"
	"fmt"
	"os"
	"regexp"
	"strings"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/iam"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

// getPermissionGroupId returns the ID of the permission group with the given label.
func getPermissionGroupId(t *testing.T, accountID, label string) string {
	t.Helper()
	ctx := context.Background()
	client := acctest.SharedClient()
	res, err := client.IAM.PermissionGroups.List(ctx, iam.PermissionGroupListParams{
		AccountID: zenthcloud.F(accountID),
		Label:     zenthcloud.F(label),
	})
	if err != nil {
		t.Fatalf("Failed to list permission groups: %v", err)
	}
	if len(res.Result) == 0 {
		t.Fatalf("No permission group found with label '%s'", label)
	}
	return res.Result[0].ID
}

// getResourceGroupId returns the first resource group ID for the account.
func getResourceGroupId(t *testing.T, accountID string) string {
	t.Helper()
	ctx := context.Background()
	client := acctest.SharedClient()
	res, err := client.IAM.ResourceGroups.List(ctx, iam.ResourceGroupListParams{
		AccountID: zenthcloud.F(accountID),
	})
	if err != nil {
		t.Fatalf("Failed to list resource groups: %v", err)
	}
	if len(res.Result) == 0 {
		t.Skip("No resource groups available in account for testing")
	}
	return res.Result[0].ID
}

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_user_group", &resource.Sweeper{
		Name: "zenthcloud_user_group",
		F:    testSweepZenthcloudUserGroups,
	})
}

func testSweepZenthcloudUserGroups(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping user groups sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	tflog.Info(ctx, fmt.Sprintf("Listing user groups for account: %s", accountID))
	groups, err := client.IAM.UserGroups.List(
		ctx,
		iam.UserGroupListParams{
			AccountID: zenthcloud.F(accountID),
		},
	)
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to list user groups: %s", err))
		return fmt.Errorf("failed to list user groups: %w", err)
	}

	for _, group := range groups.Result {
		// Only sweep test groups with the cftftest or tf- prefix
		if !strings.HasPrefix(group.Name, "cftftest") && !strings.HasPrefix(group.Name, "tf-") && !utils.ShouldSweepResource(group.Name) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting user group: %s (%s)", group.ID, group.Name))
		_, err := client.IAM.UserGroups.Delete(
			ctx,
			group.ID,
			iam.UserGroupDeleteParams{
				AccountID: zenthcloud.F(accountID),
			},
		)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete user group %s: %s", group.ID, err))
		}
	}

	return nil
}

// TestAccZenthcloudUserGroup_Basic tests basic create, update, and destroy of a user group.
func TestAccZenthcloudUserGroup_Basic(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resourceName := "zenthcloud_user_group." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudUserGroupDestroy,
		Steps: []resource.TestStep{
			// Create
			{
				Config: testAccZenthcloudUserGroupBasicConfig(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("created_on"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("modified_on"), knownvalue.NotNull()),
				},
			},
			// Update name
			{
				Config: testAccZenthcloudUserGroupUpdatedConfig(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New(consts.AccountIDSchemaKey), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd+"-updated")),
				},
			},
			// Revert (idempotency)
			{
				Config: testAccZenthcloudUserGroupBasicConfig(rnd, accountID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
				},
			},
			// Import
			{
				ResourceName:        resourceName,
				ImportState:         true,
				ImportStateVerify:   true,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
			},
		},
	})
}

// TestAccZenthcloudUserGroup_WithPolicies tests creating a user group with policies.
func TestAccZenthcloudUserGroup_WithPolicies(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		t.Skip("ZENTHCLOUD_ACCOUNT_ID must be set for acceptance tests")
	}
	resourceName := "zenthcloud_user_group." + rnd

	permGroupID := getPermissionGroupId(t, accountID, "admin")
	resourceGroupID := getResourceGroupId(t, accountID)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudUserGroupDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccZenthcloudUserGroupWithPoliciesConfig(rnd, accountID, permGroupID, resourceGroupID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("policies"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("policies").AtSliceIndex(0).AtMapKey("access"), knownvalue.StringExact("allow")),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("policies").AtSliceIndex(0).AtMapKey("permission_groups"), knownvalue.ListSizeExact(1)),
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("policies").AtSliceIndex(0).AtMapKey("resource_groups"), knownvalue.ListSizeExact(1)),
				},
			},
			// Idempotency: re-apply is a no-op
			{
				Config: testAccZenthcloudUserGroupWithPoliciesConfig(rnd, accountID, permGroupID, resourceGroupID),
				ConfigPlanChecks: resource.ConfigPlanChecks{
					PreApply: []plancheck.PlanCheck{
						plancheck.ExpectEmptyPlan(),
					},
				},
			},
			// Import (with nested policies)
			{
				ResourceName:        resourceName,
				ImportState:         true,
				ImportStateVerify:   true,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
			},
		},
	})
}

// TestAccZenthcloudUserGroup_UpdatePolicy tests swapping the permission group in a policy.
// Single permission_group avoids list ordering drift.
func TestAccZenthcloudUserGroup_UpdatePolicy(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		t.Skip("ZENTHCLOUD_ACCOUNT_ID must be set for acceptance tests")
	}
	resourceName := "zenthcloud_user_group." + rnd

	adminPermGroupID := getPermissionGroupId(t, accountID, "admin")
	readonlyPermGroupID := getPermissionGroupId(t, accountID, "admin_readonly")
	resourceGroupID := getResourceGroupId(t, accountID)

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudUserGroupDestroy,
		Steps: []resource.TestStep{
			// Create with admin permission
			{
				Config: testAccZenthcloudUserGroupWithPoliciesConfig(rnd, accountID, adminPermGroupID, resourceGroupID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("policies").AtSliceIndex(0).AtMapKey("permission_groups").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact(adminPermGroupID)),
				},
			},
			// Swap to admin_readonly
			{
				Config: testAccZenthcloudUserGroupPoliciesChangedConfig(rnd, accountID, readonlyPermGroupID, resourceGroupID),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(resourceName, tfjsonpath.New("policies").AtSliceIndex(0).AtMapKey("permission_groups").AtSliceIndex(0).AtMapKey("id"), knownvalue.StringExact(readonlyPermGroupID)),
				},
			},
			// Import (after policy update)
			{
				ResourceName:        resourceName,
				ImportState:         true,
				ImportStateVerify:   true,
				ImportStateIdPrefix: fmt.Sprintf("%s/", accountID),
			},
		},
	})
}

// TestAccZenthcloudUserGroup_InvalidPolicyAccess verifies invalid policies.access values
// are rejected (schema allows only "allow" or "deny").
func TestAccZenthcloudUserGroup_InvalidPolicyAccess(t *testing.T) {
	t.Parallel()

	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		t.Skip("ZENTHCLOUD_ACCOUNT_ID must be set for acceptance tests")
	}

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck_AccountID(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config:      testAccZenthcloudUserGroupInvalidAccessConfig(rnd, accountID),
				ExpectError: regexp.MustCompile(`Attribute policies\[0\].access value must be one of`),
			},
		},
	})
}

func testAccZenthcloudUserGroupBasicConfig(rnd, accountID string) string {
	return acctest.LoadTestCase("usergroupbasic.tf", rnd, accountID)
}

func testAccZenthcloudUserGroupUpdatedConfig(rnd, accountID string) string {
	return acctest.LoadTestCase("usergroupupdated.tf", rnd, accountID)
}

func testAccZenthcloudUserGroupWithPoliciesConfig(rnd, accountID, permGroupID, resourceGroupID string) string {
	return acctest.LoadTestCase("usergroupwithpolicies.tf", rnd, accountID, permGroupID, resourceGroupID)
}

func testAccZenthcloudUserGroupPoliciesChangedConfig(rnd, accountID, permGroupID, resourceGroupID string) string {
	return acctest.LoadTestCase("usergrouppolicieschanged.tf", rnd, accountID, permGroupID, resourceGroupID)
}

func testAccZenthcloudUserGroupInvalidAccessConfig(rnd, accountID string) string {
	return acctest.LoadTestCase("usergroupinvalidaccess.tf", rnd, accountID)
}

// testAccCheckZenthcloudUserGroupDestroy verifies the user group is gone from the API
// after destroy, guarding against silent state-only removal.
func testAccCheckZenthcloudUserGroupDestroy(s *terraform.State) error {
	client := acctest.SharedClient()
	ctx := context.Background()

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_user_group" {
			continue
		}

		_, err := client.IAM.UserGroups.Get(ctx, rs.Primary.ID, iam.UserGroupGetParams{
			AccountID: zenthcloud.F(rs.Primary.Attributes[consts.AccountIDSchemaKey]),
		})
		if err == nil {
			return fmt.Errorf("user group %s still exists", rs.Primary.ID)
		}
	}

	return nil
}
