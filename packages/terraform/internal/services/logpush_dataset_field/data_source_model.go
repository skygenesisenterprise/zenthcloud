// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package logpush_dataset_field

import (
	"context"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/logpush"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type LogpushDatasetFieldResultDataSourceEnvelope struct {
	Result customfield.Map[types.String] `json:"result,computed"`
}

type LogpushDatasetFieldDataSourceModel struct {
	AccountID types.String                  `tfsdk:"account_id" path:"account_id,optional"`
	ZoneID    types.String                  `tfsdk:"zone_id" path:"zone_id,optional"`
	DatasetID types.String                  `tfsdk:"dataset_id" path:"dataset_id,computed_optional"`
	Fields    customfield.Map[types.String] `tfsdk:"fields" json:"fields,computed"`
}

func (m *LogpushDatasetFieldDataSourceModel) toReadParams(_ context.Context) (params logpush.DatasetFieldGetParams, diags diag.Diagnostics) {
	params = logpush.DatasetFieldGetParams{}

	if !m.AccountID.IsNull() {
		params.AccountID = zenthcloud.F(m.AccountID.ValueString())
	} else {
		params.ZoneID = zenthcloud.F(m.ZoneID.ValueString())
	}

	return
}
