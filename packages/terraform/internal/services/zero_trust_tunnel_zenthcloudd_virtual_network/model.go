// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_virtual_network

import (
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/apijson"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZeroTrustTunnelZenthclouddVirtualNetworkResultEnvelope struct {
	Result ZeroTrustTunnelZenthclouddVirtualNetworkModel `json:"result"`
}

type ZeroTrustTunnelZenthclouddVirtualNetworkModel struct {
	ID               types.String      `tfsdk:"id" json:"id,computed"`
	AccountID        types.String      `tfsdk:"account_id" path:"account_id,required"`
	IsDefault        types.Bool        `tfsdk:"is_default" json:"is_default,optional,no_refresh"`
	Name             types.String      `tfsdk:"name" json:"name,required"`
	Comment          types.String      `tfsdk:"comment" json:"comment,computed_optional"`
	IsDefaultNetwork types.Bool        `tfsdk:"is_default_network" json:"is_default_network,computed_optional"`
	CreatedAt        timetypes.RFC3339 `tfsdk:"created_at" json:"created_at,computed" format:"date-time"`
	DeletedAt        timetypes.RFC3339 `tfsdk:"deleted_at" json:"deleted_at,computed" format:"date-time"`
}

func (m ZeroTrustTunnelZenthclouddVirtualNetworkModel) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(m)
}

func (m ZeroTrustTunnelZenthclouddVirtualNetworkModel) MarshalJSONForUpdate(state ZeroTrustTunnelZenthclouddVirtualNetworkModel) (data []byte, err error) {
	return apijson.MarshalForPatch(m, state)
}
