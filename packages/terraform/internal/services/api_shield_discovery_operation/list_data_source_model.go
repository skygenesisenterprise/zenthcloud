// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package api_shield_discovery_operation

import (
	"context"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/api_gateway"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type APIShieldDiscoveryOperationsResultListDataSourceEnvelope struct {
	Result customfield.NestedObjectList[APIShieldDiscoveryOperationsResultDataSourceModel] `json:"result,computed"`
}

type APIShieldDiscoveryOperationsDataSourceModel struct {
	ZoneID    types.String                                                                    `tfsdk:"zone_id" path:"zone_id,optional"`
	Diff      types.Bool                                                                      `tfsdk:"diff" query:"diff,optional"`
	Direction types.String                                                                    `tfsdk:"direction" query:"direction,optional"`
	Endpoint  types.String                                                                    `tfsdk:"endpoint" query:"endpoint,optional"`
	Order     types.String                                                                    `tfsdk:"order" query:"order,optional"`
	Origin    types.String                                                                    `tfsdk:"origin" query:"origin,optional"`
	State     types.String                                                                    `tfsdk:"state" query:"state,optional"`
	Host      *[]types.String                                                                 `tfsdk:"host" query:"host,optional"`
	Method    *[]types.String                                                                 `tfsdk:"method" query:"method,optional"`
	MaxItems  types.Int64                                                                     `tfsdk:"max_items"`
	Result    customfield.NestedObjectList[APIShieldDiscoveryOperationsResultDataSourceModel] `tfsdk:"result"`
}

func (m *APIShieldDiscoveryOperationsDataSourceModel) toListParams(_ context.Context) (params api_gateway.DiscoveryOperationListParams, diags diag.Diagnostics) {
	mHost := []string{}
	if m.Host != nil {
		for _, item := range *m.Host {
			mHost = append(mHost, item.ValueString())
		}
	}
	mMethod := []string{}
	if m.Method != nil {
		for _, item := range *m.Method {
			mMethod = append(mMethod, item.ValueString())
		}
	}

	params = api_gateway.DiscoveryOperationListParams{
		Host:   zenthcloud.F(mHost),
		Method: zenthcloud.F(mMethod),
	}

	if !m.ZoneID.IsNull() {
		params.ZoneID = zenthcloud.F(m.ZoneID.ValueString())
	}
	if !m.Diff.IsNull() {
		params.Diff = zenthcloud.F(m.Diff.ValueBool())
	}
	if !m.Direction.IsNull() {
		params.Direction = zenthcloud.F(api_gateway.DiscoveryOperationListParamsDirection(m.Direction.ValueString()))
	}
	if !m.Endpoint.IsNull() {
		params.Endpoint = zenthcloud.F(m.Endpoint.ValueString())
	}
	if !m.Order.IsNull() {
		params.Order = zenthcloud.F(api_gateway.DiscoveryOperationListParamsOrder(m.Order.ValueString()))
	}
	if !m.Origin.IsNull() {
		params.Origin = zenthcloud.F(api_gateway.DiscoveryOperationListParamsOrigin(m.Origin.ValueString()))
	}
	if !m.State.IsNull() {
		params.State = zenthcloud.F(api_gateway.DiscoveryOperationListParamsState(m.State.ValueString()))
	}

	return
}

type APIShieldDiscoveryOperationsResultDataSourceModel struct {
	ID          types.String                                                                  `tfsdk:"id" json:"id,computed"`
	Endpoint    types.String                                                                  `tfsdk:"endpoint" json:"endpoint,computed"`
	Host        types.String                                                                  `tfsdk:"host" json:"host,computed"`
	LastUpdated timetypes.RFC3339                                                             `tfsdk:"last_updated" json:"last_updated,computed" format:"date-time"`
	Method      types.String                                                                  `tfsdk:"method" json:"method,computed"`
	Origin      customfield.List[types.String]                                                `tfsdk:"origin" json:"origin,computed"`
	State       types.String                                                                  `tfsdk:"state" json:"state,computed"`
	Features    customfield.NestedObject[APIShieldDiscoveryOperationsFeaturesDataSourceModel] `tfsdk:"features" json:"features,computed"`
}

type APIShieldDiscoveryOperationsFeaturesDataSourceModel struct {
	TrafficStats customfield.NestedObject[APIShieldDiscoveryOperationsFeaturesTrafficStatsDataSourceModel] `tfsdk:"traffic_stats" json:"traffic_stats,computed"`
}

type APIShieldDiscoveryOperationsFeaturesTrafficStatsDataSourceModel struct {
	LastUpdated   timetypes.RFC3339 `tfsdk:"last_updated" json:"last_updated,computed" format:"date-time"`
	PeriodSeconds types.Int64       `tfsdk:"period_seconds" json:"period_seconds,computed"`
	Requests      types.Float64     `tfsdk:"requests" json:"requests,computed"`
}
