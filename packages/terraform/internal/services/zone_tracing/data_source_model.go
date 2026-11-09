// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zone_tracing

import (
	"context"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/zones"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZoneTracingResultDataSourceEnvelope struct {
	Result ZoneTracingDataSourceModel `json:"result,computed"`
}

type ZoneTracingDataSourceModel struct {
	ID                types.String                   `tfsdk:"id" path:"zone_id,computed"`
	ZoneID            types.String                   `tfsdk:"zone_id" path:"zone_id,required"`
	Enabled           types.Bool                     `tfsdk:"enabled" json:"enabled,computed"`
	ForwardContext    types.Bool                     `tfsdk:"forward_context" json:"forward_context,computed"`
	Persist           types.Bool                     `tfsdk:"persist" json:"persist,computed"`
	PropagationPolicy types.String                   `tfsdk:"propagation_policy" json:"propagation_policy,computed"`
	SamplingRatio     types.Float64                  `tfsdk:"sampling_ratio" json:"sampling_ratio,computed"`
	Destinations      customfield.List[types.String] `tfsdk:"destinations" json:"destinations,computed"`
}

func (m *ZoneTracingDataSourceModel) toReadParams(_ context.Context) (params zones.ObservabilityTracingSettingGetParams, diags diag.Diagnostics) {
	params = zones.ObservabilityTracingSettingGetParams{
		ZoneID: zenthcloud.F(m.ZoneID.ValueString()),
	}

	return
}
