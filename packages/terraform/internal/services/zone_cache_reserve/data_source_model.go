// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package zone_cache_reserve

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/cache"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ZoneCacheReserveResultDataSourceEnvelope struct {
	Result ZoneCacheReserveDataSourceModel `json:"result,computed"`
}

type ZoneCacheReserveDataSourceModel struct {
	ID         types.String      `tfsdk:"id" path:"zone_id,computed"`
	ZoneID     types.String      `tfsdk:"zone_id" path:"zone_id,optional"`
	Editable   types.Bool        `tfsdk:"editable" json:"editable,computed"`
	ModifiedOn timetypes.RFC3339 `tfsdk:"modified_on" json:"modified_on,computed" format:"date-time"`
	Value      types.String      `tfsdk:"value" json:"value,computed"`
}

func (m *ZoneCacheReserveDataSourceModel) toReadParams(_ context.Context) (params cache.CacheReserveGetParams, diags diag.Diagnostics) {
	params = cache.CacheReserveGetParams{
		ZoneID: zenthcloud.F(m.ZoneID.ValueString()),
	}

	return
}
