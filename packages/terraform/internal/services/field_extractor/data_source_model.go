// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package field_extractor

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/field_extractors"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type FieldExtractorResultDataSourceEnvelope struct {
	Result FieldExtractorDataSourceModel `json:"result,computed"`
}

type FieldExtractorDataSourceModel struct {
	AccountID types.String                                                     `tfsdk:"account_id" path:"account_id,required"`
	Extractor types.String                                                     `tfsdk:"extractor" path:"extractor,required"`
	Rules     customfield.NestedObjectList[FieldExtractorRulesDataSourceModel] `tfsdk:"rules" json:"rules,computed"`
}

func (m *FieldExtractorDataSourceModel) toReadParams(_ context.Context) (params field_extractors.FieldExtractorGetParams, diags diag.Diagnostics) {
	params = field_extractors.FieldExtractorGetParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	return
}

type FieldExtractorRulesDataSourceModel struct {
	Fields      customfield.NestedObjectList[FieldExtractorRulesFieldsDataSourceModel] `tfsdk:"fields" json:"fields,computed"`
	Ref         types.String                                                           `tfsdk:"ref" json:"ref,computed"`
	Description types.String                                                           `tfsdk:"description" json:"description,computed"`
}

type FieldExtractorRulesFieldsDataSourceModel struct {
	Expression types.String `tfsdk:"expression" json:"expression,computed"`
	Name       types.String `tfsdk:"name" json:"name,computed"`
}
