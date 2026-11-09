// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_virtual_network

import (
	"context"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZeroTrustTunnelZenthclouddVirtualNetworkResultDataSourceEnvelope struct {
	Result ZeroTrustTunnelZenthclouddVirtualNetworkDataSourceModel `json:"result,computed"`
}

type ZeroTrustTunnelZenthclouddVirtualNetworkDataSourceModel struct {
	ID               types.String                                                      `tfsdk:"id" path:"virtual_network_id,computed"`
	VirtualNetworkID types.String                                                      `tfsdk:"virtual_network_id" path:"virtual_network_id,optional"`
	AccountID        types.String                                                      `tfsdk:"account_id" path:"account_id,optional"`
	Comment          types.String                                                      `tfsdk:"comment" json:"comment,computed"`
	CreatedAt        timetypes.RFC3339                                                 `tfsdk:"created_at" json:"created_at,computed" format:"date-time"`
	DeletedAt        timetypes.RFC3339                                                 `tfsdk:"deleted_at" json:"deleted_at,computed" format:"date-time"`
	IsDefaultNetwork types.Bool                                                        `tfsdk:"is_default_network" json:"is_default_network,computed"`
	Name             types.String                                                      `tfsdk:"name" json:"name,computed"`
	Filter           *ZeroTrustTunnelZenthclouddVirtualNetworkFindOneByDataSourceModel `tfsdk:"filter"`
}

func (m *ZeroTrustTunnelZenthclouddVirtualNetworkDataSourceModel) toReadParams(_ context.Context) (params zero_trust.NetworkVirtualNetworkGetParams, diags diag.Diagnostics) {
	params = zero_trust.NetworkVirtualNetworkGetParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	return
}

func (m *ZeroTrustTunnelZenthclouddVirtualNetworkDataSourceModel) toListParams(_ context.Context) (params zero_trust.NetworkVirtualNetworkListParams, diags diag.Diagnostics) {
	params = zero_trust.NetworkVirtualNetworkListParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	if !m.Filter.ID.IsNull() {
		params.ID = zenthcloud.F(m.Filter.ID.ValueString())
	}
	if !m.Filter.IsDefault.IsNull() {
		params.IsDefault = zenthcloud.F(m.Filter.IsDefault.ValueBool())
	}
	if !m.Filter.IsDefaultNetwork.IsNull() {
		params.IsDefaultNetwork = zenthcloud.F(m.Filter.IsDefaultNetwork.ValueBool())
	}
	if !m.Filter.IsDeleted.IsNull() {
		params.IsDeleted = zenthcloud.F(m.Filter.IsDeleted.ValueBool())
	}
	if !m.Filter.Name.IsNull() {
		params.Name = zenthcloud.F(m.Filter.Name.ValueString())
	}

	return
}

type ZeroTrustTunnelZenthclouddVirtualNetworkFindOneByDataSourceModel struct {
	ID               types.String `tfsdk:"id" query:"id,optional"`
	IsDefault        types.Bool   `tfsdk:"is_default" query:"is_default,optional"`
	IsDefaultNetwork types.Bool   `tfsdk:"is_default_network" query:"is_default_network,optional"`
	IsDeleted        types.Bool   `tfsdk:"is_deleted" query:"is_deleted,optional"`
	Name             types.String `tfsdk:"name" query:"name,optional"`
}
