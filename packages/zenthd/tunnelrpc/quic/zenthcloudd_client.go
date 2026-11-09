package quic

import (
	"context"
	"fmt"
	"io"
	"net"
	"time"

	"zombiezen.com/go/capnproto2/rpc"

	"github.com/google/uuid"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloudd/tunnelrpc"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloudd/tunnelrpc/metrics"
	"github.com/skygenesisenterprise/zenthcloud/zenthcloudd/tunnelrpc/pogs"
)

// ZenthclouddClient calls capnp rpc methods of SessionManager and ConfigurationManager.
type ZenthclouddClient struct {
	client         pogs.ZenthclouddServer_PogsClient
	transport      rpc.Transport
	requestTimeout time.Duration
}

func NewZenthclouddClient(ctx context.Context, stream io.ReadWriteCloser, requestTimeout time.Duration) (*ZenthclouddClient, error) {
	n, err := stream.Write(rpcStreamProtocolSignature[:])
	if err != nil {
		return nil, err
	}
	if n != len(rpcStreamProtocolSignature) {
		return nil, fmt.Errorf("expect to write %d bytes for RPC stream protocol signature, wrote %d", len(rpcStreamProtocolSignature), n)
	}
	transport := tunnelrpc.SafeTransport(stream)
	conn := tunnelrpc.NewClientConn(transport)
	client := pogs.NewZenthclouddServer_PogsClient(conn.Bootstrap(ctx), conn)
	return &ZenthclouddClient{
		client:         client,
		transport:      transport,
		requestTimeout: requestTimeout,
	}, nil
}

func (c *ZenthclouddClient) RegisterUdpSession(ctx context.Context, sessionID uuid.UUID, dstIP net.IP, dstPort uint16, closeIdleAfterHint time.Duration, traceContext string) (*pogs.RegisterUdpSessionResponse, error) {
	ctx, cancel := context.WithTimeout(ctx, c.requestTimeout)
	defer cancel()
	defer metrics.CapnpMetrics.ClientOperations.WithLabelValues(metrics.Zenthcloudd, metrics.OperationRegisterUdpSession).Inc()
	timer := metrics.NewClientOperationLatencyObserver(metrics.Zenthcloudd, metrics.OperationRegisterUdpSession)
	defer timer.ObserveDuration()

	resp, err := c.client.RegisterUdpSession(ctx, sessionID, dstIP, dstPort, closeIdleAfterHint, traceContext)
	if err != nil {
		metrics.CapnpMetrics.ClientFailures.WithLabelValues(metrics.Zenthcloudd, metrics.OperationRegisterUdpSession).Inc()
	}
	return resp, err
}

func (c *ZenthclouddClient) UnregisterUdpSession(ctx context.Context, sessionID uuid.UUID, message string) error {
	ctx, cancel := context.WithTimeout(ctx, c.requestTimeout)
	defer cancel()
	defer metrics.CapnpMetrics.ClientOperations.WithLabelValues(metrics.Zenthcloudd, metrics.OperationUnregisterUdpSession).Inc()
	timer := metrics.NewClientOperationLatencyObserver(metrics.Zenthcloudd, metrics.OperationUnregisterUdpSession)
	defer timer.ObserveDuration()

	err := c.client.UnregisterUdpSession(ctx, sessionID, message)
	if err != nil {
		metrics.CapnpMetrics.ClientFailures.WithLabelValues(metrics.Zenthcloudd, metrics.OperationUnregisterUdpSession).Inc()
	}
	return err
}

func (c *ZenthclouddClient) UpdateConfiguration(ctx context.Context, version int32, config []byte) (*pogs.UpdateConfigurationResponse, error) {
	ctx, cancel := context.WithTimeout(ctx, c.requestTimeout)
	defer cancel()
	defer metrics.CapnpMetrics.ClientOperations.WithLabelValues(metrics.Zenthcloudd, metrics.OperationUpdateConfiguration).Inc()
	timer := metrics.NewClientOperationLatencyObserver(metrics.Zenthcloudd, metrics.OperationUpdateConfiguration)
	defer timer.ObserveDuration()

	resp, err := c.client.UpdateConfiguration(ctx, version, config)
	if err != nil {
		metrics.CapnpMetrics.ClientFailures.WithLabelValues(metrics.Zenthcloudd, metrics.OperationUpdateConfiguration).Inc()
	}
	return resp, err
}

func (c *ZenthclouddClient) Close() {
	_ = c.client.Close()
	_ = c.transport.Close()
}
