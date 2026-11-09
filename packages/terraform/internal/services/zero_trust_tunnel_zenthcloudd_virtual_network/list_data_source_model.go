// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_virtual_network

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZeroTrustTunnelZenthclouddVirtualNetworksResultListDataSourceEnvelope struct {
	Result customfield.NestedObjectList[ZeroTrustTunnelZenthclouddVirtualNetworksResultDataSourceModel] `json:"result,computed"`
}

type ZeroTrustTunnelZenthclouddVirtualNetworksDataSourceModel struct {
	AccountID        types.String                                                                                 `tfsdk:"account_id" path:"account_id,optional"`
	ID               types.String                                                                                 `tfsdk:"id" query:"id,optional"`
	IsDefault        types.Bool                                                                                   `tfsdk:"is_default" query:"is_default,optional"`
	IsDefaultNetwork types.Bool                                                                                   `tfsdk:"is_default_network" query:"is_default_network,optional"`
	IsDeleted        types.Bool                                                                                   `tfsdk:"is_deleted" query:"is_deleted,optional"`
	Name             types.String                                                                                 `tfsdk:"name" query:"name,optional"`
	MaxItems         types.Int64                                                                                  `tfsdk:"max_items"`
	Result           customfield.NestedObjectList[ZeroTrustTunnelZenthclouddVirtualNetworksResultDataSourceModel] `tfsdk:"result"`
}

func (m *ZeroTrustTunnelZenthclouddVirtualNetworksDataSourceModel) toListParams(_ context.Context) (params zero_trust.NetworkVirtualNetworkListParams, diags diag.Diagnostics) {
	params = zero_trust.NetworkVirtualNetworkListParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	if !m.ID.IsNull() {
		params.ID = zenthcloud.F(m.ID.ValueString())
	}
	if !m.IsDefault.IsNull() {
		params.IsDefault = zenthcloud.F(m.IsDefault.ValueBool())
	}
	if !m.IsDefaultNetwork.IsNull() {
		params.IsDefaultNetwork = zenthcloud.F(m.IsDefaultNetwork.ValueBool())
	}
	if !m.IsDeleted.IsNull() {
		params.IsDeleted = zenthcloud.F(m.IsDeleted.ValueBool())
	}
	if !m.Name.IsNull() {
		params.Name = zenthcloud.F(m.Name.ValueString())
	}

	return
}

type ZeroTrustTunnelZenthclouddVirtualNetworksResultDataSourceModel struct {
	ID               types.String      `tfsdk:"id" json:"id,computed"`
	Comment          types.String      `tfsdk:"comment" json:"comment,computed"`
	CreatedAt        timetypes.RFC3339 `tfsdk:"created_at" json:"created_at,computed" format:"date-time"`
	IsDefaultNetwork types.Bool        `tfsdk:"is_default_network" json:"is_default_network,computed"`
	Name             types.String      `tfsdk:"name" json:"name,computed"`
	DeletedAt        timetypes.RFC3339 `tfsdk:"deleted_at" json:"deleted_at,computed" format:"date-time"`
}
