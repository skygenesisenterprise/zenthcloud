package v500_test

import (
	_ "embed"
	"fmt"
	"os"
	"testing"

	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/knownvalue"
	"github.com/hashicorp/terraform-plugin-testing/statecheck"
	"github.com/hashicorp/terraform-plugin-testing/tfjsonpath"

	"github.com/zenthcloud/terraform-provider-zenthcloud/internal"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
)

var (
	currentProviderVersion = internal.PackageVersion // Current v5 release
)

// Embed migration test configuration files
//
//go:embed testdata/v4_basic.tf
var v4BasicConfig string

//go:embed testdata/v5_basic.tf
var v5BasicConfig string

// TestMigrateZeroTrustDeviceManagedNetworksBasic tests migration from v4 zenthcloud_device_managed_networks to v5 zenthcloud_zero_trust_device_managed_networks
func TestMigrateZeroTrustDeviceManagedNetworksBasic(t *testing.T) {
	testCases := []struct {
		name     string
		version  string
		configFn func(rnd, accountID string) string
	}{
		{
			name:     "from_v4_latest",
			version:  acctest.GetLastV4Version(),
			configFn: func(rnd, accountID string) string { return fmt.Sprintf(v4BasicConfig, rnd, accountID, rnd) },
		},
		{
			name:     "from_v5",
			version:  currentProviderVersion,
			configFn: func(rnd, accountID string) string { return fmt.Sprintf(v5BasicConfig, rnd, accountID, rnd) },
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			accountID := os.Getenv("ZENTHCLOUD_ACCOUNT_ID")
			rnd := utils.GenerateRandomResourceName()
			tmpDir := t.TempDir()
			testConfig := tc.configFn(rnd, accountID)
			sourceVer, targetVer := acctest.InferMigrationVersions(tc.version)

			// For v5 tests, use local provider; for v4 tests, use external provider
			var firstStep resource.TestStep
			if tc.version == currentProviderVersion {
				// Use local v5 provider (has GetSchemaVersion, will create version=1 state)
				firstStep = resource.TestStep{
					ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
					Config:                   testConfig,
				}
			} else {
				// Use external v4 provider (will create version=0 state)
				firstStep = resource.TestStep{
					ExternalProviders: map[string]resource.ExternalProvider{
						"zenthcloud": {
							Source:            "zenthcloud/zenthcloud",
							VersionConstraint: tc.version,
						},
					},
					Config: testConfig,
				}
			}

			resource.Test(t, resource.TestCase{
				PreCheck: func() {
					acctest.TestAccPreCheck(t)
					acctest.TestAccPreCheck_AccountID(t)
				},
				WorkingDir: tmpDir,
				Steps: []resource.TestStep{
					firstStep,
					// Step 2: Run migration and verify state
					acctest.MigrationV2TestStep(t, testConfig, tmpDir, tc.version, sourceVer, targetVer, []statecheck.StateCheck{
						// Resource should be renamed to zenthcloud_zero_trust_device_managed_networks
						// Validate ALL fields as requested

						// Required fields - exact match
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_device_managed_networks."+rnd,
							tfjsonpath.New("account_id"),
							knownvalue.StringExact(accountID)),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_device_managed_networks."+rnd,
							tfjsonpath.New("name"),
							knownvalue.StringExact(fmt.Sprintf("tf-test-managed-network-%s", rnd))),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_device_managed_networks."+rnd,
							tfjsonpath.New("type"),
							knownvalue.StringExact("tls")),

						// Computed fields - verify they exist
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_device_managed_networks."+rnd,
							tfjsonpath.New("id"),
							knownvalue.NotNull()),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_device_managed_networks."+rnd,
							tfjsonpath.New("network_id"),
							knownvalue.NotNull()),

						// Config nested object - verify structure conversion (array → object) and field values
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_device_managed_networks."+rnd,
							tfjsonpath.New("config"),
							knownvalue.NotNull()),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_device_managed_networks."+rnd,
							tfjsonpath.New("config").AtMapKey("tls_sockaddr"),
							knownvalue.StringExact("example.com:443")),
						statecheck.ExpectKnownValue("zenthcloud_zero_trust_device_managed_networks."+rnd,
							tfjsonpath.New("config").AtMapKey("sha256"),
							knownvalue.StringExact("b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c")),
					}),
				},
			})
		})
	}
}
