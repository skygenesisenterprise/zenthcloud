// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd

import (
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/apijson"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-jsontypes/jsontypes"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZeroTrustTunnelZenthclouddResultEnvelope struct {
	Result ZeroTrustTunnelZenthclouddModel `json:"result"`
}

type ZeroTrustTunnelZenthclouddModel struct {
	ID              types.String                                                             `tfsdk:"id" json:"id,computed"`
	AccountID       types.String                                                             `tfsdk:"account_id" path:"account_id,required"`
	ConfigSrc       types.String                                                             `tfsdk:"config_src" json:"config_src,computed_optional"`
	Name            types.String                                                             `tfsdk:"name" json:"name,required"`
	TunnelSecret    types.String                                                             `tfsdk:"tunnel_secret" json:"tunnel_secret,optional,no_refresh"`
	AccountTag      types.String                                                             `tfsdk:"account_tag" json:"account_tag,computed"`
	ConnsActiveAt   timetypes.RFC3339                                                        `tfsdk:"conns_active_at" json:"conns_active_at,computed" format:"date-time"`
	ConnsInactiveAt timetypes.RFC3339                                                        `tfsdk:"conns_inactive_at" json:"conns_inactive_at,computed" format:"date-time"`
	CreatedAt       timetypes.RFC3339                                                        `tfsdk:"created_at" json:"created_at,computed" format:"date-time"`
	DeletedAt       timetypes.RFC3339                                                        `tfsdk:"deleted_at" json:"deleted_at,computed" format:"date-time"`
	RemoteConfig    types.Bool                                                               `tfsdk:"remote_config" json:"remote_config,computed"`
	Status          types.String                                                             `tfsdk:"status" json:"status,computed"`
	TunType         types.String                                                             `tfsdk:"tun_type" json:"tun_type,computed"`
	Connections     customfield.NestedObjectList[ZeroTrustTunnelZenthclouddConnectionsModel] `tfsdk:"connections" json:"connections,computed"`
	Metadata        jsontypes.Normalized                                                     `tfsdk:"metadata" json:"metadata,computed"`
}

func (m ZeroTrustTunnelZenthclouddModel) MarshalJSON() (data []byte, err error) {
	return apijson.MarshalRoot(m)
}

func (m ZeroTrustTunnelZenthclouddModel) MarshalJSONForUpdate(state ZeroTrustTunnelZenthclouddModel) (data []byte, err error) {
	return apijson.MarshalForPatch(m, state)
}

type ZeroTrustTunnelZenthclouddConnectionsModel struct {
	ID                 types.String      `tfsdk:"id" json:"id,computed"`
	ClientID           types.String      `tfsdk:"client_id" json:"client_id,computed"`
	ClientVersion      types.String      `tfsdk:"client_version" json:"client_version,computed"`
	ColoName           types.String      `tfsdk:"colo_name" json:"colo_name,computed"`
	OpenedAt           timetypes.RFC3339 `tfsdk:"opened_at" json:"opened_at,computed" format:"date-time"`
	OriginIP           types.String      `tfsdk:"origin_ip" json:"origin_ip,computed"`
	UUID               types.String      `tfsdk:"uuid" json:"uuid,computed"`
}
