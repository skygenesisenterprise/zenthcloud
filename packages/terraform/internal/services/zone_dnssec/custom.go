package zone_dnssec

import (
	"context"

	"github.com/zenthcloud/zenthcloud-go/v7"
	"github.com/zenthcloud/zenthcloud-go/v7/dns"
	"github.com/zenthcloud/zenthcloud-go/v7/option"
	"github.com/zenthcloud/terraform-provider-zenthcloud/internal/logging"
	"github.com/hashicorp/terraform-plugin-framework/resource"
)

func disableDNSSECRecord(ctx context.Context, r *ZoneDNSSECResource, zoneID string, resp *resource.DeleteResponse) {
	var err error
	_, err = r.client.DNS.DNSSEC.Edit(
		ctx,
		dns.DNSSECEditParams{
			ZoneID: zenthcloud.F(zoneID),
			Status: zenthcloud.F[dns.DNSSECEditParamsStatus](dns.DNSSECEditParamsStatusDisabled),
		},
		option.WithMiddleware(logging.Middleware(ctx)),
	)
	if err != nil {
		resp.Diagnostics.AddError("failed to make http request", err.Error())
		return
	}
}
