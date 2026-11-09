// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_route

import (
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/apijson"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZeroTrustTunnelZenthclouddRouteResultEnvelope struct {
	Result ZeroTrustTunnelZenthclouddRouteModel `json:"result"`
}

type ZeroTrustTunnelZenthclouddRouteModel struct {
	ID               types.String      `tfsdk:"id" json:"id,computed"`
	AccountID        types.String      `tfsdk:"account_id" path:"account_id,required"`
	Network          types.String      `tfsdk:"network" json:"network,required"`
	TunnelID         types.String      `tfsdk:"tunnel_id" json:"tunnel_id,required"`
	Comment          types.String      `tfsdk:"comment" json:"comment,computed_optional"`
	VirtualNetworkID types.String      `tfsdk:"virtual_network_id" json:"virtual_network_id,computed_optional"`
	CreatedAt        timetypes.RFC3339 `tfsdk:"created_at" json:"created_at,computed" format:"date-time"`
	DeletedAt        timetypes.RFC3339 `tfsdk:"deleted_at" json:"deleted_at,computed" format:"date-time"`
}

func (m ZeroTrustTunnelZenthclouddRouteModel) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(m)
}

func (m ZeroTrustTunnelZenthclouddRouteModel) MarshalJSONForUpdate(state ZeroTrustTunnelZenthclouddRouteModel) (data []byte, err error) {
	return apijson.MarshalForPatch(m, state)
}
