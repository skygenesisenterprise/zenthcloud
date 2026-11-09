// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zero_trust_tunnel_zenthcloudd_config

import (
	"context"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/zero_trust"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZeroTrustTunnelZenthclouddConfigResultDataSourceEnvelope struct {
	Result ZeroTrustTunnelZenthclouddConfigDataSourceModel `json:"result,computed"`
}

type ZeroTrustTunnelZenthclouddConfigDataSourceModel struct {
	AccountID types.String                                                                    `tfsdk:"account_id" path:"account_id,required"`
	TunnelID  types.String                                                                    `tfsdk:"tunnel_id" path:"tunnel_id,required"`
	CreatedAt timetypes.RFC3339                                                               `tfsdk:"created_at" json:"created_at,computed" format:"date-time"`
	Source    types.String                                                                    `tfsdk:"source" json:"source,computed"`
	Version   types.Int64                                                                     `tfsdk:"version" json:"version,computed"`
	Config    customfield.NestedObject[ZeroTrustTunnelZenthclouddConfigConfigDataSourceModel] `tfsdk:"config" json:"config,computed"`
}

func (m *ZeroTrustTunnelZenthclouddConfigDataSourceModel) toReadParams(_ context.Context) (params zero_trust.TunnelZenthclouddConfigurationGetParams, diags diag.Diagnostics) {
	params = zero_trust.TunnelZenthclouddConfigurationGetParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	return
}

type ZeroTrustTunnelZenthclouddConfigConfigDataSourceModel struct {
	Ingress       customfield.NestedObjectList[ZeroTrustTunnelZenthclouddConfigConfigIngressDataSourceModel]   `tfsdk:"ingress" json:"ingress,computed"`
	OriginRequest customfield.NestedObject[ZeroTrustTunnelZenthclouddConfigConfigOriginRequestDataSourceModel] `tfsdk:"origin_request" json:"originRequest,computed"`
}

type ZeroTrustTunnelZenthclouddConfigConfigIngressDataSourceModel struct {
	Hostname      types.String                                                                                        `tfsdk:"hostname" json:"hostname,computed"`
	Service       types.String                                                                                        `tfsdk:"service" json:"service,computed"`
	OriginRequest customfield.NestedObject[ZeroTrustTunnelZenthclouddConfigConfigIngressOriginRequestDataSourceModel] `tfsdk:"origin_request" json:"originRequest,computed"`
	Path          types.String                                                                                        `tfsdk:"path" json:"path,computed"`
}

type ZeroTrustTunnelZenthclouddConfigConfigIngressOriginRequestDataSourceModel struct {
	Access                 customfield.NestedObject[ZeroTrustTunnelZenthclouddConfigConfigIngressOriginRequestAccessDataSourceModel] `tfsdk:"access" json:"access,computed"`
	CAPool                 types.String                                                                                              `tfsdk:"ca_pool" json:"caPool,computed"`
	ConnectTimeout         types.Int64                                                                                               `tfsdk:"connect_timeout" json:"connectTimeout,computed"`
	DisableChunkedEncoding types.Bool                                                                                                `tfsdk:"disable_chunked_encoding" json:"disableChunkedEncoding,computed"`
	HTTP2Origin            types.Bool                                                                                                `tfsdk:"http2_origin" json:"http2Origin,computed"`
	HTTPHostHeader         types.String                                                                                              `tfsdk:"http_host_header" json:"httpHostHeader,computed"`
	KeepAliveConnections   types.Int64                                                                                               `tfsdk:"keep_alive_connections" json:"keepAliveConnections,computed"`
	KeepAliveTimeout       types.Int64                                                                                               `tfsdk:"keep_alive_timeout" json:"keepAliveTimeout,computed"`
	MatchSnItoHost         types.Bool                                                                                                `tfsdk:"match_sn_ito_host" json:"matchSNItoHost,computed"`
	NoHappyEyeballs        types.Bool                                                                                                `tfsdk:"no_happy_eyeballs" json:"noHappyEyeballs,computed"`
	NoTLSVerify            types.Bool                                                                                                `tfsdk:"no_tls_verify" json:"noTLSVerify,computed"`
	OriginServerName       types.String                                                                                              `tfsdk:"origin_server_name" json:"originServerName,computed"`
	ProxyType              types.String                                                                                              `tfsdk:"proxy_type" json:"proxyType,computed"`
	TCPKeepAlive           types.Int64                                                                                               `tfsdk:"tcp_keep_alive" json:"tcpKeepAlive,computed"`
	TLSTimeout             types.Int64                                                                                               `tfsdk:"tls_timeout" json:"tlsTimeout,computed"`
}

type ZeroTrustTunnelZenthclouddConfigConfigIngressOriginRequestAccessDataSourceModel struct {
	AUDTag   customfield.List[types.String] `tfsdk:"aud_tag" json:"audTag,computed"`
	TeamName types.String                   `tfsdk:"team_name" json:"teamName,computed"`
	Required types.Bool                     `tfsdk:"required" json:"required,computed"`
}

type ZeroTrustTunnelZenthclouddConfigConfigOriginRequestDataSourceModel struct {
	Access                 customfield.NestedObject[ZeroTrustTunnelZenthclouddConfigConfigOriginRequestAccessDataSourceModel] `tfsdk:"access" json:"access,computed"`
	CAPool                 types.String                                                                                       `tfsdk:"ca_pool" json:"caPool,computed"`
	ConnectTimeout         types.Int64                                                                                        `tfsdk:"connect_timeout" json:"connectTimeout,computed"`
	DisableChunkedEncoding types.Bool                                                                                         `tfsdk:"disable_chunked_encoding" json:"disableChunkedEncoding,computed"`
	HTTP2Origin            types.Bool                                                                                         `tfsdk:"http2_origin" json:"http2Origin,computed"`
	HTTPHostHeader         types.String                                                                                       `tfsdk:"http_host_header" json:"httpHostHeader,computed"`
	KeepAliveConnections   types.Int64                                                                                        `tfsdk:"keep_alive_connections" json:"keepAliveConnections,computed"`
	KeepAliveTimeout       types.Int64                                                                                        `tfsdk:"keep_alive_timeout" json:"keepAliveTimeout,computed"`
	MatchSnItoHost         types.Bool                                                                                         `tfsdk:"match_sn_ito_host" json:"matchSNItoHost,computed"`
	NoHappyEyeballs        types.Bool                                                                                         `tfsdk:"no_happy_eyeballs" json:"noHappyEyeballs,computed"`
	NoTLSVerify            types.Bool                                                                                         `tfsdk:"no_tls_verify" json:"noTLSVerify,computed"`
	OriginServerName       types.String                                                                                       `tfsdk:"origin_server_name" json:"originServerName,computed"`
	ProxyType              types.String                                                                                       `tfsdk:"proxy_type" json:"proxyType,computed"`
	TCPKeepAlive           types.Int64                                                                                        `tfsdk:"tcp_keep_alive" json:"tcpKeepAlive,computed"`
	TLSTimeout             types.Int64                                                                                        `tfsdk:"tls_timeout" json:"tlsTimeout,computed"`
}

type ZeroTrustTunnelZenthclouddConfigConfigOriginRequestAccessDataSourceModel struct {
	AUDTag   customfield.List[types.String] `tfsdk:"aud_tag" json:"audTag,computed"`
	TeamName types.String                   `tfsdk:"team_name" json:"teamName,computed"`
	Required types.Bool                     `tfsdk:"required" json:"required,computed"`
}
