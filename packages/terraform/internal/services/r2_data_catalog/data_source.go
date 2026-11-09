// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package r2_data_catalog

import (
	"context"
	"fmt"
	"io"
	"net/http"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloud-go/v7/option"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/apijson"
	"github.com/skygenesisenterprise/zenthcloud/terraform-provider-zenthcloud/internal/logging"
	"github.com/hashicorp/terraform-plugin-framework/datasource"
)

type R2DataCatalogDataSource struct {
	client *zenthcloud.Client
}

var _ datasource.DataSourceWithConfigure = (*R2DataCatalogDataSource)(nil)

func NewR2DataCatalogDataSource() datasource.DataSource {
	return &R2DataCatalogDataSource{}
}

func (d *R2DataCatalogDataSource) Metadata(ctx context.Context, req datasource.MetadataRequest, resp *datasource.MetadataResponse) {
	resp.TypeName = req.ProviderTypeName + "_r2_data_catalog"
}

func (d *R2DataCatalogDataSource) Configure(ctx context.Context, req datasource.ConfigureRequest, resp *datasource.ConfigureResponse) {
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

func (d *R2DataCatalogDataSource) Read(ctx context.Context, req datasource.ReadRequest, resp *datasource.ReadResponse) {
	var data *R2DataCatalogDataSourceModel

	resp.Diagnostics.Append(req.Config.Get(ctx, &data)...)

	if resp.Diagnostics.HasError() {
		return
	}

	params, diags := data.toReadParams(ctx)
	resp.Diagnostics.Append(diags...)
	if resp.Diagnostics.HasError() {
		return
	}

	res := new(http.Response)
	env := R2DataCatalogResultDataSourceEnvelope{*data}
	_, err := d.client.R2DataCatalog.Get(
		ctx,
		data.BucketName.ValueString(),
		params,
		option.WithResponseBodyInto(&res),
		option.WithMiddleware(logging.Middleware(ctx)),
	)
	if err != nil {
		resp.Diagnostics.AddError("failed to make http request", err.Error())
		return
	}
	bytes, _ := io.ReadAll(res.Body)
	err = apijson.UnmarshalComputed(bytes, &env)
	if err != nil {
		resp.Diagnostics.AddError("failed to deserialize http request", err.Error())
		return
	}
	data = &env.Result
	data.ID = data.BucketName

	resp.Diagnostics.Append(resp.State.Set(ctx, &data)...)
}
