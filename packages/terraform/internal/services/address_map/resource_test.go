package address_map_test

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_address_map", &resource.Sweeper{
		Name: "zenthcloud_address_map",
		F:    testSweepZenthcloudAddressMaps,
	})
}

func testSweepZenthcloudAddressMaps(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client()
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
		return clientErr
	}

	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	if accountID == "" {
		tflog.Info(ctx, "Skipping address maps sweep: ZENTHCLOUD_ACCOUNT_ID not set")
		return nil
	}

	addressMaps, err := client.ListAddressMaps(ctx, zenthcloud.AccountIdentifier(accountID), zenthcloud.ListAddressMapsParams{})
	if err != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch address maps: %s", err))
		return fmt.Errorf("failed to fetch address maps: %w", err)
	}

	if len(addressMaps) == 0 {
		tflog.Info(ctx, "No address maps to sweep")
		return nil
	}

	for _, addressMap := range addressMaps {
		// Use standard filtering helper on the description field
		if addressMap.Description == nil || !utils.ShouldSweepResource(*addressMap.Description) {
			continue
		}

		tflog.Info(ctx, fmt.Sprintf("Deleting address map: %s (account: %s)", addressMap.ID, accountID))
		err := client.DeleteAddressMap(ctx, zenthcloud.AccountIdentifier(accountID), addressMap.ID)
		if err != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to delete address map %s: %s", addressMap.ID, err))
			continue
		}
		tflog.Info(ctx, fmt.Sprintf("Deleted address map: %s", addressMap.ID))
	}

	return nil
}

func TestAccZenthcloudAddressMap(t *testing.T) {
	acctest.TestAccSkipForDefaultAccount(t, "Pending permission fixes for IP delegation.")

	rnd := utils.GenerateRandomResourceName()
	name := fmt.Sprintf("zenthcloud_address_map.%s", rnd)
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	altZoneID := os.Getenv("ZENTHCLOUD_ALT_ZONE_ID")
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck_AccountID(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: generateZenthcloudAddressMapConfig(rnd, accountID, nil, nil, false, nil, nil),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "description", ""),
					resource.TestCheckResourceAttr(name, "default_sni", ""),
					resource.TestCheckResourceAttr(name, "enabled", "false"),
					resource.TestCheckResourceAttr(name, "ips.#", "0"),
					resource.TestCheckResourceAttr(name, "memberships.#", "0"),
				),
			},
			{
				Config: generateZenthcloudAddressMapConfig(
					rnd,
					accountID,
					zenthcloud.StringPtr(rnd),
					zenthcloud.StringPtr("*."+domain),
					true,
					[]string{"199.212.90.4", "199.212.90.5"},
					[]zenthcloud.AddressMapMembershipContainer{
						{Identifier: zoneID, Kind: zenthcloud.AddressMapMembershipZone},
						{Identifier: altZoneID, Kind: zenthcloud.AddressMapMembershipZone},
					}),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "description", rnd),
					resource.TestCheckResourceAttr(name, "default_sni", "*."+domain),
					resource.TestCheckResourceAttr(name, "enabled", "true"),
					resource.TestCheckResourceAttr(name, "ips.#", "2"),
					resource.TestCheckResourceAttr(name, "ips.0.ip", "199.212.90.4"),
					resource.TestCheckResourceAttr(name, "ips.1.ip", "199.212.90.5"),
					resource.TestCheckResourceAttr(name, "memberships.#", "2"),
					resource.TestCheckResourceAttr(name, "memberships.0.identifier", zoneID),
					resource.TestCheckResourceAttr(name, "memberships.0.kind", "zone"),
					resource.TestCheckResourceAttr(name, "memberships.1.identifier", altZoneID),
					resource.TestCheckResourceAttr(name, "memberships.1.kind", "zone"),
				),
			},
			{
				Config: generateZenthcloudAddressMapConfig(rnd, accountID, zenthcloud.StringPtr(""), zenthcloud.StringPtr("*."+domain), false, nil, nil),
				Check: resource.ComposeTestCheckFunc(
					resource.TestCheckResourceAttr(name, consts.AccountIDSchemaKey, accountID),
					resource.TestCheckResourceAttr(name, "description", ""),
					resource.TestCheckResourceAttr(name, "default_sni", "*."+domain),
					resource.TestCheckResourceAttr(name, "enabled", "false"),
					resource.TestCheckResourceAttr(name, "ips.#", "0"),
					resource.TestCheckResourceAttr(name, "memberships.#", "0"),
				),
			},
		},
	})
}

func generateZenthcloudAddressMapConfig(rnd, accountId string, desc, sni *string, enabled bool, ips []string, memberships []zenthcloud.AddressMapMembershipContainer) string {
	descFragment := "# Description"
	if desc != nil {
		descFragment = fmt.Sprintf("description = %q", *desc)
	}
	sniFragment := "# SNI"
	if sni != nil {
		sniFragment = fmt.Sprintf("default_sni = %q", *sni)
	}
	ipsFragment := "# IPs"
	if len(ips) > 0 {
		for _, ip := range ips {
			ipsFragment += fmt.Sprintf("\n  ips { ip = %q }", ip)
		}
	}
	membershipsFragment := "# Memberships"
	if len(memberships) > 0 {
		for _, membership := range memberships {
			membershipsFragment += fmt.Sprintf("\n  memberships {\n identifier = %q\n  kind = %q\n}", membership.Identifier, membership.Kind)
		}
	}

	return acctest.LoadTestCase("generatezenthcloudaddressmapconfig.tf", rnd, accountId, enabled, descFragment, sniFragment, ipsFragment, membershipsFragment)
}

func TestAccUpgradeAddressMap_FromPublishedV5(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")

	config := generateZenthcloudAddressMapConfig(rnd, accountID, nil, nil, false, nil, nil)

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
				Config:             config,
				ExpectNonEmptyPlan: true,
			},
			{
				ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
				Config:                   config,
				ExpectNonEmptyPlan:       true,
			},
		},
	})
}
