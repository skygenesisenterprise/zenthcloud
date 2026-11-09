package list_item_test

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/option"
	"github.com/zenthcloud/zenthcloud-go/v7/rules"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"

	_ "github.com/zenthcloud/terraform-provider-zenthcloud/internal/services/list"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_list_item", &resource.Sweeper{
		Name: "zenthcloud_list_item",
		F:    testSweepZenthcloudListItems,
	})
}

func testSweepZenthcloudListItems(r string) error {
	ctx := context.Background()
	client := acctest.SharedClient()

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping list items sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	// List all lists using v6 client
	listsResp, err := client.Rules.Lists.List(ctx, rules.ListListParams{
		AccountID: zenthcloud.F(accountID),
	})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch lists: %s", err))
		return fmt.Errorf("failed to fetch lists: %w", err)
	}

	if len(listsResp.Result) == 0 {
		tflog.Info(ctx, "No lists found, skipping list items sweep")
		return nil
	}

	// For each list, get and delete its items
	for _, list := range listsResp.Result {
		// Only process lists that would be swept themselves
		if !utils.ShouldSweepResource(list.Name) {
			continue
		}

		// List items for this list using auto-paging
		itemsPager := client.Rules.Lists.Items.ListAutoPaging(ctx, list.ID, rules.ListItemListParams{
			AccountID: zenthcloud.F(accountID),
		})

		type deleteItem struct {
			ID string `json:"id"`
		}
		type deletePayload struct {
			Items []deleteItem `json:"items"`
		}

		var itemsToDelete []deleteItem
		for itemsPager.Next() {
			item := itemsPager.Current()
			itemsToDelete = append(itemsToDelete, deleteItem{
				ID: item.ID,
			})
		}

		if err := itemsPager.Err(); err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to fetch items for list %s: %s", list.Name, err))
			continue
		}

		if len(itemsToDelete) == 0 {
			continue
		}

		payload := deletePayload{Items: itemsToDelete}
		deleteBody, _ := json.Marshal(payload)

		tflog.Info(ctx, fmt.Sprintf("Deleting %d items from list: %s (account: %s)", len(itemsToDelete), list.Name, accountID))
		_, err = client.Rules.Lists.Items.Delete(ctx, list.ID, rules.ListItemDeleteParams{
			AccountID: zenthcloud.F(accountID),
		}, option.WithRequestBody("application/json", deleteBody))
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete items from list %s: %s", list.Name, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted %d items from list: %s", len(itemsToDelete), list.Name))
	}

	return nil
}

func TestAccZenthcloudListItem_Basic(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_list_item.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudIPListItem(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "ip", "192.0.2.0"),
				),
			},
		},
	})
}

func TestAccZenthcloudListItem_Import(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	itemName := fmt.Sprintf("zenthcloud_list_item.%s", rnd)
	listName := fmt.Sprintf("zenthcloud_list.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	ip := "192.0.2.0"

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
			acctest.TestAccPreCheck_Credentials(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudIPListItem(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(itemName, "ip", ip),
					resource.TestCheckResourceAttr(itemName, "comment", rnd),
				),
			},
			{
				ResourceName:      itemName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateIdFunc: func(s *terraform.State) (string, error) {
					rs, ok := s.RootModule().Resources[listName]
					if !ok {
						return "", fmt.Errorf("list resource not found: %s", listName)
					}
					listID := rs.Primary.ID
					rs, ok = s.RootModule().Resources[itemName]
					if !ok {
						return "", fmt.Errorf("list_item resource not found: %s", itemName)
					}
					itemID := rs.Primary.ID
					return fmt.Sprintf("%s/%s/%s", accountID, listID, itemID), nil
				},
			},
			{
				ResourceName:    itemName,
				ImportState:     true,
				ImportStateKind: resource.ImportBlockWithID,
				ImportStateIdFunc: func(s *terraform.State) (string, error) {
					rs, ok := s.RootModule().Resources[listName]
					if !ok {
						return "", fmt.Errorf("list resource not found: %s", listName)
					}
					listID := rs.Primary.ID
					rs, ok = s.RootModule().Resources[itemName]
					if !ok {
						return "", fmt.Errorf("list_item resource not found: %s", itemName)
					}
					itemID := rs.Primary.ID
					return fmt.Sprintf("%s/%s/%s", accountID, listID, itemID), nil
				},
			},
		},
	})
}

func TestAccZenthcloudListItem_MultipleItems(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_list_item.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudIPListItemMultipleEntries(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name+"_1", "ip", "192.0.2.0"),
					resource.TestCheckResourceAttr(name+"_2", "ip", "192.0.2.1"),
					resource.TestCheckResourceAttr(name+"_3", "ip", "192.0.2.2"),
					resource.TestCheckResourceAttr(name+"_4", "ip", "192.0.2.3"),
				),
			},
		},
	})
}

func TestAccZenthcloudListItem_MultipleItemsHostname(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_list_item.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudHostnameListItemMultipleEntries(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name+"_1", "hostname.url_hostname", "a.example.com"),
					resource.TestCheckResourceAttr(name+"_2", "hostname.url_hostname", "example.com"),
				),
			},
			{
				Config: testAccCheckZenthcloudHostnameListItemMultipleEntries(rnd, rnd, rnd+"-updated", accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name+"_1", "hostname.url_hostname", "a.example.com"),
					resource.TestCheckResourceAttr(name+"_1", "comment", rnd+"-updated"),
					resource.TestCheckResourceAttr(name+"_2", "hostname.url_hostname", "example.com"),
					resource.TestCheckResourceAttr(name+"_2", "comment", rnd+"-updated"),
				),
			},
		},
	})
}

func TestAccZenthcloudListItem_Update(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_list_item.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	var listItemID string

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudIPListItem(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "ip", "192.0.2.0"),
					func(s *terraform.State) error {
						listItemID = s.RootModule().Resources[name].Primary.Attributes["id"]
						return nil
					},
				),
			},
			{
				Config: testAccCheckZenthcloudIPListItem(rnd, rnd, rnd+"-updated", accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "comment", rnd+"-updated"),
					func(s *terraform.State) error {
						newID := s.RootModule().Resources[name].Primary.Attributes["id"]
						if newID == listItemID {
							return fmt.Errorf("ID of list item did not change when updating comment")
						}
						return nil
					},
				),
			},
		},
	})
}

func TestAccZenthcloudListItem_UpdateHostname(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_list_item.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	var listItemID string

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudHostnameListItem(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "hostname.url_hostname", "example.com"),
					resource.TestCheckResourceAttr(name, "comment", rnd),
					func(s *terraform.State) error {
						listItemID = s.RootModule().Resources[name].Primary.Attributes["id"]
						return nil
					},
				),
			},
			{
				Config: testAccCheckZenthcloudHostnameListItem(rnd, rnd, rnd+"-updated", accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "hostname.url_hostname", "example.com"),
					resource.TestCheckResourceAttr(name, "comment", rnd+"-updated"),
					func(s *terraform.State) error {
						newID := s.RootModule().Resources[name].Primary.Attributes["id"]
						if newID == listItemID {
							return fmt.Errorf("ID of list item did not change when updating comment")
						}
						return nil
					},
				),
			},
		},
	})
}

func TestAccZenthcloudListItem_UpdateReplace(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_list_item.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudIPListItemNewIp(rnd, rnd, rnd, accountID, "192.0.2.0"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "ip", "192.0.2.0"),
				),
			},
			{
				Config: testAccCheckZenthcloudIPListItemNewIp(rnd, rnd, rnd, accountID, "192.0.2.1"),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "ip", "192.0.2.1"),
				),
			},
		},
	})
}

func TestAccZenthcloudListItem_ASN(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_list_item.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudASNListItem(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(
						name, "asn", "1"),
				),
			},
		},
	})
}

func TestAccZenthcloudListItem_Hostname(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_list_item.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudHostnameListItem(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "hostname.url_hostname", "example.com"),
				),
			},
		},
	})
}

func TestAccZenthcloudListItem_Redirect(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_list_item.%s", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudHostnameRedirectItem(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, "redirect.source_url", "example.com/"),
					resource.TestCheckResourceAttr(name, "redirect.target_url", "https://example1.com"),
					resource.TestCheckResourceAttr(name, "redirect.status_code", "301"),
				),
			},
		},
	})
}

func TestAccZenthcloudListItem_RedirectWithLocalsMap(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	redirect1Resource := fmt.Sprintf("zenthcloud_list_item.%s_redirect1", rnd)
	redirect2Resource := fmt.Sprintf("zenthcloud_list_item.%s_redirect2", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudHostnameRedirectItemLocalsMap(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(redirect1Resource, "redirect.source_url", rnd+"-redirect1.cfapi.net/"),
					resource.TestCheckResourceAttr(redirect1Resource, "redirect.target_url", "https://target1.com"),
					resource.TestCheckResourceAttr(redirect1Resource, "redirect.status_code", "301"),
					resource.TestCheckResourceAttr(redirect1Resource, "comment", rnd+"-redirect1"),
					resource.TestCheckResourceAttr(redirect2Resource, "redirect.source_url", rnd+"-redirect2.cfapi.net/"),
					resource.TestCheckResourceAttr(redirect2Resource, "redirect.target_url", "https://target2.com"),
					resource.TestCheckResourceAttr(redirect2Resource, "redirect.status_code", "302"),
					resource.TestCheckResourceAttr(redirect2Resource, "comment", rnd+"-redirect2"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudIPListItem(ID, name, comment, accountID string) string {
	return acctest.LoadTestCase("iplistitem.tf", ID, name, comment, accountID)
}

func testAccCheckZenthcloudIPListItemNewIp(ID, name, comment, accountID, ip string) string {
	return acctest.LoadTestCase("iplistitem_newip.tf", ID, name, comment, accountID, ip)
}

func testAccCheckZenthcloudIPListItemMultipleEntries(ID, name, comment, accountID string) string {
	return acctest.LoadTestCase("iplistitemmultipleentries.tf", ID, name, comment, accountID)
}

func testAccCheckZenthcloudHostnameListItemMultipleEntries(ID, name, comment, accountID string) string {
	return acctest.LoadTestCase("hostnamelistitemmultipleentries.tf", ID, name, comment, accountID)
}

func testAccCheckZenthcloudBadListItemType(ID, name, comment, accountID string) string {
	return acctest.LoadTestCase("badlistitemtype.tf", ID, name, comment, accountID)
}

func testAccCheckZenthcloudASNListItem(ID, name, comment, accountID string) string {
	return acctest.LoadTestCase("asnlistitem.tf", ID, name, comment, accountID)
}

func testAccCheckZenthcloudHostnameListItem(ID, name, comment, accountID string) string {
	return acctest.LoadTestCase("hostnamelistitem.tf", ID, name, comment, accountID)
}

func testAccCheckZenthcloudHostnameRedirectItem(ID, name, comment, accountID string) string {
	return acctest.LoadTestCase("hostnameredirectitem.tf", ID, name, comment, accountID)
}

func TestAccZenthcloudListItem_RedirectWithOverlappingSourceURL(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	firstResource := fmt.Sprintf("zenthcloud_list_item.%s_1", rnd)
	secondResource := fmt.Sprintf("zenthcloud_list_item.%s_2", rnd)
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudHostnameRedirectWithOverlappingSourceURL(rnd, rnd, rnd, accountID),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(firstResource, "redirect.source_url", "www.site1.com/"),
					resource.TestCheckResourceAttr(firstResource, "redirect.target_url", "https://example.com"),
					resource.TestCheckResourceAttr(firstResource, "redirect.status_code", "301"),
					resource.TestCheckResourceAttr(secondResource, "redirect.source_url", "www.site1.com/test"),
					resource.TestCheckResourceAttr(secondResource, "redirect.target_url", "https://github.com/skygenesisenterprise/zenthcloud"),
					resource.TestCheckResourceAttr(secondResource, "redirect.status_code", "301"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudHostnameRedirectWithOverlappingSourceURL(ID, name, comment, accountID string) string {
	return acctest.LoadTestCase("hostnameredirectwithoverlappingsourceurl.tf", ID, name, comment, accountID)
}

func testAccCheckZenthcloudHostnameRedirectItemLocalsMap(ID, name, comment, accountID string) string {
	return acctest.LoadTestCase("hostnameredirectitemlocalsmap.tf", ID, name, comment, accountID)
}

func TestAccUpgradeListItem_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	config := testAccCheckZenthcloudIPListItem(rnd, rnd, rnd, accountID)

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
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
