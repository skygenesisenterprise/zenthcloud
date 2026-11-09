package utils_test

import (
	"reflect"
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/utils"
)

func TestUserAgentBuilding(t *testing.T) {
	tests := []struct {
		input  utils.UserAgentBuilderParams
		expect string
	}{
		{input: utils.UserAgentBuilderParams{ProviderVersion: zenthcloud.StringPtr("1.0")}, expect: "terraform-provider-zenthcloud/1.0"},
		{input: utils.UserAgentBuilderParams{ProviderVersion: zenthcloud.StringPtr("1.0"), PluginType: zenthcloud.StringPtr("terraform-plugin-foo")}, expect: "terraform-provider-zenthcloud/1.0 terraform-plugin-foo"},
		{input: utils.UserAgentBuilderParams{ProviderVersion: zenthcloud.StringPtr("1.0"), PluginType: zenthcloud.StringPtr("terraform-plugin-foo"), PluginVersion: zenthcloud.StringPtr("1.2.3")}, expect: "terraform-provider-zenthcloud/1.0 terraform-plugin-foo/1.2.3"},
		{input: utils.UserAgentBuilderParams{ProviderVersion: zenthcloud.StringPtr("1.0"), PluginType: zenthcloud.StringPtr("terraform-plugin-foo"), PluginVersion: zenthcloud.StringPtr("1.2.3"), TerraformVersion: zenthcloud.StringPtr("9.9.9")}, expect: "terraform-provider-zenthcloud/1.0 terraform-plugin-foo/1.2.3 terraform/9.9.9"},
		{input: utils.UserAgentBuilderParams{ProviderVersion: zenthcloud.StringPtr("1.0"), OperatorSuffix: zenthcloud.StringPtr("example/v88")}, expect: "terraform-provider-zenthcloud/1.0 example/v88"},
		{input: utils.UserAgentBuilderParams{ProviderVersion: zenthcloud.StringPtr("1.0"), OperatorSuffix: zenthcloud.StringPtr("example/v88"), TerraformVersion: zenthcloud.StringPtr("1.2.3")}, expect: "terraform-provider-zenthcloud/1.0 example/v88"},
		{input: utils.UserAgentBuilderParams{ProviderVersion: zenthcloud.StringPtr("1.0"), TerraformVersion: zenthcloud.StringPtr("1.2.3")}, expect: "terraform-provider-zenthcloud/1.0 terraform/1.2.3"},
	}

	for _, tc := range tests {
		got := utils.BuildUserAgent(tc.input)
		if !reflect.DeepEqual(tc.expect, got) {
			t.Fatalf("expected: %v, got: %v", tc.expect, got)
		}
	}
}
