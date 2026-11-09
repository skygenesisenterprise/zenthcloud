// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package secrets_store_secret

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/secrets_store"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework-timetypes/timetypes"
	"github.com/hashicorp/terraform-plugin-framework/diag"
	"github.com/hashicorp/terraform-plugin-framework/types"
)

type SecretsStoreSecretsResultListDataSourceEnvelope struct {
	Result customfield.NestedObjectList[SecretsStoreSecretsResultDataSourceModel] `json:"result,computed"`
}

type SecretsStoreSecretsDataSourceModel struct {
	AccountID types.String                                                           `tfsdk:"account_id" path:"account_id,required"`
	StoreID   types.String                                                           `tfsdk:"store_id" path:"store_id,required"`
	Search    types.String                                                           `tfsdk:"search" query:"search,optional"`
	Scopes    *[]types.String                                                        `tfsdk:"scopes" query:"scopes,optional"`
	Direction types.String                                                           `tfsdk:"direction" query:"direction,computed_optional"`
	Order     types.String                                                           `tfsdk:"order" query:"order,computed_optional"`
	MaxItems  types.Int64                                                            `tfsdk:"max_items"`
	Result    customfield.NestedObjectList[SecretsStoreSecretsResultDataSourceModel] `tfsdk:"result"`
}

func (m *SecretsStoreSecretsDataSourceModel) toListParams(_ context.Context) (params secrets_store.StoreSecretListParams, diags diag.Diagnostics) {
	mScopes := []secrets_store.StoreSecretListParamsScope{}
	if m.Scopes != nil {
		for _, item := range *m.Scopes {
			mScopes = append(mScopes, secrets_store.StoreSecretListParamsScope(item.ValueString()))
		}
	}

	params = secrets_store.StoreSecretListParams{
		AccountID: zenthcloud.F(m.AccountID.ValueString()),
		Scopes:    zenthcloud.F(mScopes),
	}

	if !m.Direction.IsNull() {
		params.Direction = zenthcloud.F(secrets_store.StoreSecretListParamsDirection(m.Direction.ValueString()))
	}
	if !m.Order.IsNull() {
		params.Order = zenthcloud.F(secrets_store.StoreSecretListParamsOrder(m.Order.ValueString()))
	}
	if !m.Search.IsNull() {
		params.Search = zenthcloud.F(m.Search.ValueString())
	}

	return
}

type SecretsStoreSecretsResultDataSourceModel struct {
	ID       types.String                   `tfsdk:"id" json:"id,computed"`
	Created  timetypes.RFC3339              `tfsdk:"created" json:"created,computed" format:"date-time"`
	Modified timetypes.RFC3339              `tfsdk:"modified" json:"modified,computed" format:"date-time"`
	Name     types.String                   `tfsdk:"name" json:"name,computed"`
	Status   types.String                   `tfsdk:"status" json:"status,computed"`
	StoreID  types.String                   `tfsdk:"store_id" json:"store_id,computed"`
	Comment  types.String                   `tfsdk:"comment" json:"comment,computed"`
	Scopes   customfield.List[types.String] `tfsdk:"scopes" json:"scopes,computed"`
}
