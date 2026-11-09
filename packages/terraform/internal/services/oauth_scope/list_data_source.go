// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package oauth_scope

import (
	"context"
	"fmt"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/apijson"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/customfield"
	"github.com/hashicorp/terraform-plugin-framework/attr"
	"github.com/hashicorp/terraform-plugin-framework/datasource"
)

type OAuthScopesDataSource struct {
	client *zenthcloud.Client
}

var _ datasource.DataSourceWithConfigure = (*OAuthScopesDataSource)(nil)

func NewOAuthScopesDataSource() datasource.DataSource {
	return &OAuthScopesDataSource{}
}

func (d *OAuthScopesDataSource) Metadata(ctx context.Context, req datasource.MetadataRequest, resp *datasource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_oauth_scopes"
}

func (d *OAuthScopesDataSource) Configure(ctx context.Context, req datasource.ConfigureRequest, resp *datasource.ConfigureResponse) {
	if req.ProviderData == nil {
		return
	}

	client, ok := req.ProviderData.(*zenthcloud.Client)

	if !ok {
		resp.Diagnostics.AddError(
			"unexpected resource configure type",
			fmt.Sprintf("Expected *zenthcloud.Client, got: %T. Please report this issue to the provider developers.", req.ProviderData),
		)

		return
	}

	d.client = client
}

func (d *OAuthScopesDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
	var data *OAuthScopesDataSourceModel

	resp.Diagnostics.Append(req.Config.Get(ctx, &data)...)

	if resp.Diagnostics.HasError() {
		return
	}

	env := OAuthScopesResultListDataSourceEnvelope{}
	maxItems := int(data.MaxItems.ValueInt64())
	acc := []attr.Value{}
	if maxItems <= 0 {
		maxItems = 1000
	}
	page, err := d.client.IAM.OAuthScopes.List(ctx)
	if err != nil {
		resp.Diagnostics.AddError("failed to make http request", err.Error())
		return
	}

	for page != nil && len(page.Result) > 0 {
		bytes := []byte(page.JSON.RawJSON())
		err = apijson.UnmarshalComputed(bytes, &env)
		if err != nil {
			resp.Diagnostics.AddError("failed to unmarshal http request", err.Error())
			return
		}
		acc = append(acc, env.Result.Elements()...)
		if len(acc) >= maxItems {
			break
		}
		page, err = page.GetNextPage()
		if err != nil {
			resp.Diagnostics.AddError("failed to fetch next page", err.Error())
			return
		}
	}

	acc = acc[:min(len(acc), maxItems)]
	result, diags := customfield.NewObjectListFromAttributes[OAuthScopesResultDataSourceModel](ctx, acc)
	resp.Diagnostics.Append(diags...)
	data.Result = result

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}
