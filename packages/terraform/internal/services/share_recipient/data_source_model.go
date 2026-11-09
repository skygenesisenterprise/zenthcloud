// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package share_recipient

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/resource_sharing"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type ShareRecipientResultDataSourceEnvelope struct {
	Result ShareRecipientDataSourceModel `json:"result,computed"`
}

type ShareRecipientDataSourceModel struct {
	ID                types.String                                                         `tfsdk:"id" path:"recipient_id,computed"`
	RecipientID       types.String                                                         `tfsdk:"recipient_id" path:"recipient_id,required"`
	AccountID         types.String                                                         `tfsdk:"account_id" path:"account_id,required"`
	ShareID           types.String                                                         `tfsdk:"share_id" path:"share_id,required"`
	IncludeResources  types.Bool                                                           `tfsdk:"include_resources" query:"include_resources,optional"`
	AssociationStatus types.String                                                         `tfsdk:"association_status" json:"association_status,computed"`
	Created           timetypes.RFC3339                                                    `tfsdk:"created" json:"created,computed" format:"date-time"`
	Modified          timetypes.RFC3339                                                    `tfsdk:"modified" json:"modified,computed" format:"date-time"`
	Resources         customfield.NestedObjectList[ShareRecipientResourcesDataSourceModel] `tfsdk:"resources" json:"resources,computed"`
}

func (m *ShareRecipientDataSourceModel) toReadParams(_ context.Context) (params resource_sharing.RecipientGetParams, diags diag.Diagnostics) {
	params = resource_sharing.RecipientGetParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
	}

	if !m.IncludeResources.IsNull() {
		params.IncludeResources = zenthcloud.F(m.IncludeResources.ValueBool())
	}

	return
}

type ShareRecipientResourcesDataSourceModel struct {
	Error           types.String `tfsdk:"error" json:"error,computed"`
	ResourceID      types.String `tfsdk:"resource_id" json:"resource_id,computed"`
	ResourceVersion types.Int64  `tfsdk:"resource_version" json:"resource_version,computed"`
	Terminal        types.Bool   `tfsdk:"terminal" json:"terminal,computed"`
}
