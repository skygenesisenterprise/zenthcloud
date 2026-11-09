// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_route

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZeroTrustTunnelZenthclouddRoutesResultListDataSourceEnvelope struct {
	Result customfield.NestedObjectList[ZeroTrustTunnelZenthclouddRoutesResultDataSourceModel] `json:"result,computed"`
}

type ZeroTrustTunnelZenthclouddRoutesDataSourceModel struct {
	AccountID        types.String                                                                        `tfsdk:"account_id" path:"account_id,optional"`
	ExistedAt        types.String                                                                        `tfsdk:"existed_at" query:"existed_at,optional"`
	IsDeleted        types.Bool                                                                          `tfsdk:"is_deleted" query:"is_deleted,optional"`
	NetworkSubset    types.String                                                                        `tfsdk:"network_subset" query:"network_subset,optional"`
	NetworkSuperset  types.String                                                                        `tfsdk:"network_superset" query:"network_superset,optional"`
	RouteID          types.String                                                                        `tfsdk:"route_id" query:"route_id,optional"`
	TunnelID         types.String                                                                        `tfsdk:"tunnel_id" query:"tunnel_id,optional"`
	VirtualNetworkID types.String                                                                        `tfsdk:"virtual_network_id" query:"virtual_network_id,optional"`
	TunTypes         *[]types.String                                                                     `tfsdk:"tun_types" query:"tun_types,optional"`
	Comment          types.String                                                                        `tfsdk:"comment" query:"comment,computed_optional"`
	MaxItems         types.Int64                                                                         `tfsdk:"max_items"`
	Result           customfield.NestedObjectList[ZeroTrustTunnelZenthclouddRoutesResultDataSourceModel] `tfsdk:"result"`
}

func (m *ZeroTrustTunnelZenthclouddRoutesDataSourceModel) toListParams(_ context.Context) (params zero_trust.NetworkRouteListParams, diags diag.Diagnostics) {
	mTunTypes := []zero_trust.NetworkRouteListParamsTunType{}
	if m.TunTypes != nil {
		for _, item := range *m.TunTypes {
			mTunTypes = append(mTunTypes, zero_trust.NetworkRouteListParamsTunType(item.ValueString()))
		}
	}

	params = zero_trust.NetworkRouteListParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
		TunTypes:  zenthcloud.F(mTunTypes),
	}

	if !m.Comment.IsNull() {
		params.Comment = zenthcloud.F(m.Comment.ValueString())
	}
	if !m.ExistedAt.IsNull() {
		params.ExistedAt = zenthcloud.F(m.ExistedAt.ValueString())
	}
	if !m.IsDeleted.IsNull() {
		params.IsDeleted = zenthcloud.F(m.IsDeleted.ValueBool())
	}
	if !m.NetworkSubset.IsNull() {
		params.NetworkSubset = zenthcloud.F(m.NetworkSubset.ValueString())
	}
	if !m.NetworkSuperset.IsNull() {
		params.NetworkSuperset = zenthcloud.F(m.NetworkSuperset.ValueString())
	}
	if !m.RouteID.IsNull() {
		params.RouteID = zenthcloud.F(m.RouteID.ValueString())
	}
	if !m.TunnelID.IsNull() {
		params.TunnelID = zenthcloud.F(m.TunnelID.ValueString())
	}
	if !m.VirtualNetworkID.IsNull() {
		params.VirtualNetworkID = zenthcloud.F(m.VirtualNetworkID.ValueString())
	}

	return
}

type ZeroTrustTunnelZenthclouddRoutesResultDataSourceModel struct {
	ID                 types.String      `tfsdk:"id" json:"id,computed"`
	Comment            types.String      `tfsdk:"comment" json:"comment,computed"`
	CreatedAt          timetypes.RFC3339 `tfsdk:"created_at" json:"created_at,computed" format:"date-time"`
	DeletedAt          timetypes.RFC3339 `tfsdk:"deleted_at" json:"deleted_at,computed" format:"date-time"`
	Network            types.String      `tfsdk:"network" json:"network,computed"`
	TunType            types.String      `tfsdk:"tun_type" json:"tun_type,computed"`
	TunnelID           types.String      `tfsdk:"tunnel_id" json:"tunnel_id,computed"`
	TunnelName         types.String      `tfsdk:"tunnel_name" json:"tunnel_name,computed"`
	VirtualNetworkID   types.String      `tfsdk:"virtual_network_id" json:"virtual_network_id,computed"`
	VirtualNetworkName types.String      `tfsdk:"virtual_network_name" json:"virtual_network_name,computed"`
}
