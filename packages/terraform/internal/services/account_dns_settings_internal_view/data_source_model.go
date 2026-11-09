// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package account_dns_settings_internal_view

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/dns"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type AccountDNSSettingsInternalViewResultDataSourceEnvelope struct {
	Result AccountDNSSettingsInternalViewDataSourceModel `json:"result,computed"`
}

type AccountDNSSettingsInternalViewDataSourceModel struct {
	ID           types.String                                            `tfsdk:"id" path:"view_id,computed"`
	ViewID       types.String                                            `tfsdk:"view_id" path:"view_id,optional"`
	AccountID    types.String                                            `tfsdk:"account_id" path:"account_id,optional"`
	CreatedTime  timetypes.RFC3339                                       `tfsdk:"created_time" json:"created_time,computed" format:"date-time"`
	ModifiedTime timetypes.RFC3339                                       `tfsdk:"modified_time" json:"modified_time,computed" format:"date-time"`
	Name         types.String                                            `tfsdk:"name" json:"name,computed"`
	Zones        customfield.Set[types.String]                           `tfsdk:"zones" json:"zones,computed"`
	Filter       *AccountDNSSettingsInternalViewFindOneByDataSourceModel `tfsdk:"filter"`
}

func (m *AccountDNSSettingsInternalViewDataSourceModel) toReadParams(_ context.Context) (params dns.SettingAccountViewGetParams, diags diag.Diagnostics) {
	params = dns.SettingAccountViewGetParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	return
}

func (m *AccountDNSSettingsInternalViewDataSourceModel) toListParams(_ context.Context) (params dns.SettingAccountViewListParams, diags diag.Diagnostics) {
	params = dns.SettingAccountViewListParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	if !m.Filter.Direction.IsNull() {
		params.Direction = zenthcloud.F(dns.SettingAccountViewListParamsDirection(m.Filter.Direction.ValueString()))
	}
	if !m.Filter.Match.IsNull() {
		params.Match = zenthcloud.F(dns.SettingAccountViewListParamsMatch(m.Filter.Match.ValueString()))
	}
	if m.Filter.Name != nil {
		paramsName := dns.SettingAccountViewListParamsName{}
		if !m.Filter.Name.Contains.IsNull() {
			paramsName.Contains = zenthcloud.F(m.Filter.Name.Contains.ValueString())
		}
		if !m.Filter.Name.Endswith.IsNull() {
			paramsName.Endswith = zenthcloud.F(m.Filter.Name.Endswith.ValueString())
		}
		if !m.Filter.Name.Exact.IsNull() {
			paramsName.Exact = zenthcloud.F(m.Filter.Name.Exact.ValueString())
		}
		if !m.Filter.Name.Startswith.IsNull() {
			paramsName.Startswith = zenthcloud.F(m.Filter.Name.Startswith.ValueString())
		}
		params.Name = zenthcloud.F(paramsName)
	}
	if !m.Filter.Order.IsNull() {
		params.Order = zenthcloud.F(dns.SettingAccountViewListParamsOrder(m.Filter.Order.ValueString()))
	}
	if !m.Filter.ZoneID.IsNull() {
		params.ZoneID = zenthcloud.F(m.Filter.ZoneID.ValueString())
	}
	if !m.Filter.ZoneName.IsNull() {
		params.ZoneName = zenthcloud.F(m.Filter.ZoneName.ValueString())
	}

	return
}

type AccountDNSSettingsInternalViewFindOneByDataSourceModel struct {
	Direction types.String                                        `tfsdk:"direction" query:"direction,computed_optional"`
	Match     types.String                                        `tfsdk:"match" query:"match,computed_optional"`
	Name      *AccountDNSSettingsInternalViewsNameDataSourceModel `tfsdk:"name" query:"name,optional"`
	Order     types.String                                        `tfsdk:"order" query:"order,optional"`
	ZoneID    types.String                                        `tfsdk:"zone_id" query:"zone_id,optional"`
	ZoneName  types.String                                        `tfsdk:"zone_name" query:"zone_name,optional"`
}
