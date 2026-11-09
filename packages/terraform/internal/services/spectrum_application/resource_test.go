package spectrum_application_test

import (
	"context"
	"errors"
	"fmt"
	"os"
	"testing"

	"github.com/zenthcloud/zenthcloud-go"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/acctest"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/consts"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/utils"
	"github.com/hashicorp/terraform-plugin-log/tflog"
	"github.com/hashicorp/terraform-plugin-testing/helper/resource"
	"github.com/hashicorp/terraform-plugin-testing/plancheck"
	"github.com/hashicorp/terraform-plugin-testing/terraform"
)

func TestMain(m *testing.M) {
	resource.TestMain(m)
}

func init() {
	resource.AddTestSweepers("zenthcloud_spectrum_applications", &resource.Sweeper{
		Name: "zenthcloud_spectrum_applications",
		F:    testSweepZenthcloudSpectrumApplications,
	})
}

func testSweepZenthcloudSpectrumApplications(r string) error {
	ctx := context.Background()
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to create Zenthcloud client: %s", clientErr))
	}

	zone := os.Getenv("ZENTHCLOUD_DOMAIN")
	zones, zoneErr := client.ListZones(context.Background(), zone)

	if zoneErr != nil {
		tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zenthcloud zones: %s", zoneErr))
	}

	for _, zone := range zones {
		spectrumApps, spectrumErr := client.SpectrumApplications(context.Background(), zone.ID)
		if spectrumErr != nil {
			tflog.Error(ctx, fmt.Sprintf("Failed to fetch Zenthcloud spectrum applications: %s", zoneErr))
		}

		if len(spectrumApps) == 0 {
			tflog.Info(ctx, "No Zenthcloud spectrum applications to sweep")
			continue
		}

		for _, application := range spectrumApps {
			// Use standard filtering helper on DNS field
			if application.DNS.Name != "" && !utils.ShouldSweepResource(application.DNS.Name) {
				continue
			}

			tflog.Info(ctx, fmt.Sprintf("Deleting Zenthcloud Spectrum Application: %s (%s)", application.DNS.Name, application.ID))
			err := client.DeleteSpectrumApplication(context.Background(), zone.ID, application.ID)

			if err != nil {
				tflog.Error(ctx, fmt.Sprintf("Failed to delete Spectrum Application %s (%s): %s", application.DNS.Name, application.ID, err))
				continue
			}
			tflog.Info(ctx, fmt.Sprintf("Deleted Spectrum Application: %s (%s)", application.DNS.Name, application.ID))
		}
	}

	return nil
}

func TestAccZenthcloudSpectrumApplication_Basic(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudSpectrumApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigBasic(zoneID, domain, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "protocol", "tcp/22"),
					resource.TestCheckResourceAttr(name, "origin_direct.#", "1"),
					resource.TestCheckResourceAttr(name, "origin_direct.0", "tcp://128.66.0.1:23"),
					resource.TestCheckResourceAttr(name, "origin_port", "22"),
				),
			},
			{
				ResourceName:            name,
				ImportStateIdPrefix:     fmt.Sprintf("%s/", zoneID),
				ImportState:             true,
				ImportStateVerify:       true,
				ImportStateVerifyIgnore: []string{"argo_smart_routing"},
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_OriginDNS(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudSpectrumApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigOriginDNS(zoneID, domain, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "protocol", "tcp/22"),
					resource.TestCheckResourceAttr(name, "origin_dns.name", fmt.Sprintf("%s.origin.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "origin_port", "22"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_PortRange(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudSpectrumApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigOriginPortRange(zoneID, domain, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "protocol", "tcp/8080-8081"),
					resource.TestCheckResourceAttr(name, "origin_dns.name", fmt.Sprintf("%s.origin.%s", rnd, domain)),
					resource.TestCheckResourceAttr(name, "origin_port", "8080-8081"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_Update(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	var initialID string
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		CheckDestroy:             testAccCheckZenthcloudSpectrumApplicationDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigBasic(zoneID, domain, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "origin_direct.0", "tcp://128.66.0.1:23"),
				),
			},
			{
				PreConfig: func() {
					initialID = spectrumApp.ID
				},
				Config: testAccCheckZenthcloudSpectrumApplicationConfigBasicUpdated(zoneID, domain, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					func(state *terraform.State) error {
						if initialID != spectrumApp.ID {
							// want in place update
							return fmt.Errorf("spectrum application id is different after second config applied ( %s -> %s )", initialID, spectrumApp.ID)
						}
						return nil
					},
					resource.TestCheckResourceAttr(name, "origin_direct.0", "tcp://128.66.0.2:23"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudSpectrumApplicationDestroy(s *terraform.State) error {
	client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
	if clientErr != nil {
		tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
	}

	for _, rs := range s.RootModule().Resources {
		if rs.Type != "zenthcloud_spectrum_application" {
			continue
		}

		_, err := client.SpectrumApplication(context.Background(), rs.Primary.Attributes[consts.ZoneIDSchemaKey], rs.Primary.ID)
		if err == nil {
			return fmt.Errorf("spectrum application still exists: %s", rs.Primary.ID)
		}
	}

	return nil
}

func TestAccZenthcloudSpectrumApplication_EdgeIPConnectivity(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigEdgeIPConnectivity(zoneID, domain, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "edge_ips.connectivity", "ipv4"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_EdgeIPsMultiple(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigMultipleEdgeIPs(zoneID, domain, rnd, `"172.65.64.13", "172.65.64.49"`),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckTypeSetElemAttr(name, "edge_ips.ips.*", "172.65.64.13"),
					resource.TestCheckTypeSetElemAttr(name, "edge_ips.ips.*", "172.65.64.49"),
				),
			},
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigMultipleEdgeIPs(zoneID, domain, rnd, `"172.65.64.49", "172.65.64.13"`),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckTypeSetElemAttr(name, "edge_ips.ips.*", "172.65.64.13"),
					resource.TestCheckTypeSetElemAttr(name, "edge_ips.ips.*", "172.65.64.49"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_BasicSSH(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigBasicTypes(zoneID, domain, rnd, "ssh", 22),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "protocol", "ssh"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_BasicRDP(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigBasicTypes(zoneID, domain, rnd, "rdp", 3389),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "protocol", "rdp"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_TLS(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigTLS(zoneID, domain, rnd, "flexible"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "tls", "flexible"),
				),
			},
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigTLS(zoneID, domain, rnd, "full"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "tls", "full"),
				),
			},
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigTLS(zoneID, domain, rnd, "strict"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "tls", "strict"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_ProxyProtocol(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigProxyProtocol(zoneID, domain, rnd, "v1"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "proxy_protocol", "v1"),
				),
			},
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigProxyProtocol(zoneID, domain, rnd, "v2"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "proxy_protocol", "v2"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_IPFirewall(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigIPFirewall(zoneID, domain, rnd, "true"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "ip_firewall", "true"),
				),
			},
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigIPFirewall(zoneID, domain, rnd, "false"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "ip_firewall", "false"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_ArgoSmartRouting(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigArgoSmartRouting(zoneID, domain, rnd, "true"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "argo_smart_routing", "true"),
					resource.TestCheckResourceAttr(name, "traffic_type", "direct"),
				),
			},
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigArgoSmartRouting(zoneID, domain, rnd, "false"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "argo_smart_routing", "false"),
					resource.TestCheckResourceAttr(name, "traffic_type", "direct"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_TrafficType(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigTrafficType(zoneID, domain, rnd, "http"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "traffic_type", "http"),
				),
			},
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigTrafficType(zoneID, domain, rnd, "https"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "traffic_type", "https"),
				),
			},
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigTrafficType(zoneID, domain, rnd, "direct"),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "traffic_type", "direct"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_IPv6Connectivity(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigIPv6(zoneID, domain, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "edge_ips.connectivity", "ipv6"),
				),
			},
		},
	})
}

func TestAccZenthcloudSpectrumApplication_UDP(t *testing.T) {
	var spectrumApp zenthcloud.SpectrumApplication
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()
	name := "zenthcloud_spectrum_application." + rnd

	resource.Test(t, resource.TestCase{
		PreCheck:                 func() { acctest.TestAccPreCheck(t) },
		ProtoV6ProviderFactories: acctest.TestAccProtoV6ProviderFactories,
		Steps: []resource.TestStep{
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigUDP(zoneID, domain, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "protocol", "udp/53"),
					resource.TestCheckResourceAttr(name, "traffic_type", "direct"),
				),
			},
			{
				Config: testAccCheckZenthcloudSpectrumApplicationConfigSimpleProxyProtocol(zoneID, domain, rnd),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckZenthcloudSpectrumApplicationExists(name, &spectrumApp),
					testAccCheckZenthcloudSpectrumApplicationIDIsValid(name),
					resource.TestCheckResourceAttr(name, "proxy_protocol", "simple"),
				),
			},
		},
	})
}

func testAccCheckZenthcloudSpectrumApplicationExists(n string, spectrumApp *zenthcloud.SpectrumApplication) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("not found: %s", n)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No Load Balancer ID is set")
		}

		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}
		foundSpectrumApplication, err := client.SpectrumApplication(context.Background(), rs.Primary.Attributes[consts.ZoneIDSchemaKey], rs.Primary.ID)
		if err != nil {
			return err
		}

		*spectrumApp = foundSpectrumApplication

		return nil
	}
}

func testAccCheckZenthcloudSpectrumApplicationIDIsValid(n string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("not found: %s", n)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No ID is set")
		}

		if len(rs.Primary.ID) != 32 {
			return fmt.Errorf("invalid id %q, should be a string of length 32", rs.Primary.ID)
		}

		if zoneID, ok := rs.Primary.Attributes[consts.ZoneIDSchemaKey]; !ok || len(zoneID) < 1 {
			return errors.New("zone_id is unset, should always be set with id")
		}
		return nil
	}
}

func testAccManuallyDeleteSpectrumApplication(name string, spectrumApp *zenthcloud.SpectrumApplication, initialID *string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, _ := s.RootModule().Resources[name]
		client, clientErr := acctest.SharedV1Client() // TODO(terraform): replace with SharedV2Clent
		if clientErr != nil {
			tflog.Error(context.TODO(), fmt.Sprintf("failed to create Zenthcloud client: %s", clientErr))
		}
		*initialID = spectrumApp.ID
		err := client.DeleteSpectrumApplication(context.Background(), rs.Primary.Attributes[consts.ZoneIDSchemaKey], rs.Primary.ID)
		if err != nil {
			return err
		}
		return nil
	}
}

func testAccCheckZenthcloudSpectrumApplicationConfigBasic(zoneID, zoneName, ID string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigbasic.tf", zoneID, zoneName, ID)
}

func testAccCheckZenthcloudSpectrumApplicationConfigOriginDNS(zoneID, zoneName, ID string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigorigindns.tf", zoneID, zoneName, ID)
}

func testAccCheckZenthcloudSpectrumApplicationConfigOriginPortRange(zoneID, zoneName, ID string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigoriginportrange.tf", zoneID, zoneName, ID)
}

func testAccCheckZenthcloudSpectrumApplicationConfigBasicUpdated(zoneID, zoneName, ID string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigbasicupdated.tf", zoneID, zoneName, ID)
}

func testAccCheckZenthcloudSpectrumApplicationConfigEdgeIPConnectivity(zoneID, zoneName, ID string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigedgeipconnectivity.tf", zoneID, zoneName, ID)
}

func testAccCheckZenthcloudSpectrumApplicationConfigEdgeIPsWithoutConnectivity(zoneID, zoneName, ID string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigedgeipswithoutconnectivity.tf", zoneID, zoneName, ID)
}

func testAccCheckZenthcloudSpectrumApplicationConfigMultipleEdgeIPs(zoneID, zoneName, ID, IPs string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigmultipleedgeips.tf", zoneID, zoneName, ID, IPs)
}

func testAccCheckZenthcloudSpectrumApplicationConfigBasicTypes(zoneID, zoneName, ID, protocol string, port int) string {
	return acctest.LoadTestCase("spectrumapplicationconfigbasictypes.tf", zoneID, zoneName, ID, protocol, port)
}

func testAccCheckZenthcloudSpectrumApplicationConfigTLS(zoneID, zoneName, ID, tls string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigtls.tf", zoneID, zoneName, ID, tls)
}

func testAccCheckZenthcloudSpectrumApplicationConfigProxyProtocol(zoneID, zoneName, ID, proxyProtocol string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigproxyprotocol.tf", zoneID, zoneName, ID, proxyProtocol)
}

func testAccCheckZenthcloudSpectrumApplicationConfigSimpleProxyProtocol(zoneID, zoneName, ID string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigsimpleproxyprotocol.tf", zoneID, zoneName, ID)
}

func testAccCheckZenthcloudSpectrumApplicationConfigIPFirewall(zoneID, zoneName, ID, ipFirewall string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigipfirewall.tf", zoneID, zoneName, ID, ipFirewall)
}

func testAccCheckZenthcloudSpectrumApplicationConfigArgoSmartRouting(zoneID, zoneName, ID, argoSmartRouting string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigargosmartrouting.tf", zoneID, zoneName, ID, argoSmartRouting)
}

func testAccCheckZenthcloudSpectrumApplicationConfigTrafficType(zoneID, zoneName, ID, trafficType string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigtraffictype.tf", zoneID, zoneName, ID, trafficType)
}

func testAccCheckZenthcloudSpectrumApplicationConfigIPv6(zoneID, zoneName, ID string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigipv6.tf", zoneID, zoneName, ID)
}

func testAccCheckZenthcloudSpectrumApplicationConfigUDP(zoneID, zoneName, ID string) string {
	return acctest.LoadTestCase("spectrumapplicationconfigudp.tf", zoneID, zoneName, ID)
}

func TestAccUpgradeSpectrumApplication_FromPublishedV5(t *testing.T) {
	domain := os.Getenv("ZENTHCLOUD_DOMAIN")
	zoneID := os.Getenv("ZENTHCLOUD_ZONE_ID")
	rnd := utils.GenerateRandomResourceName()

	config := testAccCheckZenthcloudSpectrumApplicationConfigBasic(zoneID, domain, rnd)

	resource.Test(t, resource.TestCase{
		PreCheck: func() { acctest.TestAccPreCheck(t) },
		Steps: []resource.TestStep{
			{
				// Step 1: Create with v5.16.0 (schema version 0)
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.16.0",
					},
				},
				Config: config,
			},
			{
				// Step 2: Upgrade to v5.17.0 (stepping stone - schema version 1)
				ExternalProviders: map[string]resource.ExternalProvider{
					"zenthcloud": {
						Source:            "zenthcloud/zenthcloud",
						VersionConstraint: "5.17.0",
					},
				},
				Config: config,
			},
			{
				// Step 3: Upgrade to current provider (schema version 500)
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
