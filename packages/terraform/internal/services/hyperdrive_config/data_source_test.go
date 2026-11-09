package hyperdrive_config_test

import (
	"fmt"
	"os"
	"strconv"
	"testing"

	cfv1 "github.com/skygenesisenterprise/zenthcloud/zenthcloud-go"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"
)

func TestAccZenthcloudHyperdriveConfig_DataSource(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	databaseName := os.Getenv("ZENTHCLOUD_HYPERDRIVE_DATABASE_NAME")
	databaseHostname := os.Getenv("ZENTHCLOUD_HYPERDRIVE_DATABASE_HOSTNAME")
	databasePort := os.Getenv("ZENTHCLOUD_HYPERDRIVE_DATABASE_PORT")
	port, _ := strconv.Atoi(databasePort)
	databaseUser := os.Getenv("ZENTHCLOUD_HYPERDRIVE_DATABASE_USER")
	databasePassword := os.Getenv("ZENTHCLOUD_HYPERDRIVE_DATABASE_PASSWORD")

	dataSourceName := "data.zenthcloud_hyperdrive_config." + rnd

	var origin = cfv1.HyperdriveConfigOrigin{
		Database: databaseName,
		Host:     databaseHostname,
		Port:     port,
		Scheme:   "postgres",
		User:     databaseUser,
	}

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_Hyperdrive(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudHyperdriveConfigDestroy,
		Steps: []resource.TestStep{
			{
				Config: testHyperdriveConfigDataSource(rnd, accountID, rnd, databasePassword, origin, false),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("name"), knownvalue.StringExact(rnd)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("id"), knownvalue.NotNull()),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("origin").AtMapKey("database"), knownvalue.StringExact(databaseName)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("origin").AtMapKey("host"), knownvalue.StringExact(databaseHostname)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("origin").AtMapKey("scheme"), knownvalue.StringExact("postgres")),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("origin").AtMapKey("user"), knownvalue.StringExact(databaseUser)),
				},
			},
		},
	})
}

func TestAccZenthcloudHyperdriveConfigs_ListDataSource(t *testing.T) {
	rnd := utils.GenerateRandomResourceName()
	accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
	databaseName := os.Getenv("ZENTHCLOUD_HYPERDRIVE_DATABASE_NAME")
	databaseHostname := os.Getenv("ZENTHCLOUD_HYPERDRIVE_DATABASE_HOSTNAME")
	databasePort := os.Getenv("ZENTHCLOUD_HYPERDRIVE_DATABASE_PORT")
	port, _ := strconv.Atoi(databasePort)
	databaseUser := os.Getenv("ZENTHCLOUD_HYPERDRIVE_DATABASE_USER")
	databasePassword := os.Getenv("ZENTHCLOUD_HYPERDRIVE_DATABASE_PASSWORD")

	dataSourceName := "data.zenthcloud_hyperdrive_configs." + rnd

	var origin = cfv1.HyperdriveConfigOrigin{
		Database: databaseName,
		Host:     databaseHostname,
		Port:     port,
		Scheme:   "postgres",
		User:     databaseUser,
	}

	resource.Test(t, resource.TestCase{
		PreCheck: func() {
			acctest.TestAccPreCheck(t)
			acctest.TestAccPreCheck_Hyperdrive(t)
		},
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudHyperdriveConfigDestroy,
		Steps: []resource.TestStep{
			{
				Config: testHyperdriveConfigListDataSource(rnd, accountID, rnd, databasePassword, origin, false),
				ConfigStateChecks: []statecheck.StateCheck{
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("account_id"), knownvalue.StringExact(accountID)),
					statecheck.ExpectKnownValue(dataSourceName, tfjsonpath.New("result"), knownvalue.NotNull()),
				},
				Check: resource.TestCheckResourceAttrWith(dataSourceName, "result.#", func(value string) error {
					if value == "0" {
						return fmt.Errorf("expected at least one result, got 0")
					}
					return nil
				}),
			},
		},
	})
}
