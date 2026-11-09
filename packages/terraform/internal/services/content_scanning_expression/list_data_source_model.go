// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package content_scanning_expression

import (
	"context"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/content_scanning"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ContentScanningExpressionsResultListDataSourceEnvelope struct {
	Result customfield.NestedObjectList[ContentScanningExpressionsResultDataSourceModel] `json:"result,computed"`
}

type ContentScanningExpressionsDataSourceModel struct {
	ZoneID   types.String                                                                  `tfsdk:"zone_id" path:"zone_id,optional"`
	MaxItems types.Int64                                                                   `tfsdk:"max_items"`
	Result   customfield.NestedObjectList[ContentScanningExpressionsResultDataSourceModel] `tfsdk:"result"`
}

func (m *ContentScanningExpressionsDataSourceModel) toListParams(_ context.Context) (params content_scanning.PayloadListParams, diags diag.Diagnostics) {
	params = content_scanning.PayloadListParams{
		ZoneID: zenthcloud.F(m.ZoneID.ValueString()),
	}

	return
}

type ContentScanningExpressionsResultDataSourceModel struct {
	ID      types.String `tfsdk:"id" json:"id,computed"`
	Payload types.String `tfsdk:"payload" json:"payload,computed"`
}
