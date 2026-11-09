package pogs

import (
	capnp "zombiezen.com/go/capnproto2"
	"zombiezen.com/go/capnproto2/rpc"

	"github.com/skygenesisenterprise/zenthcloud/zenthcloudd/tunnelrpc/proto"
)

type ZenthclouddServer interface {
	SessionManager
	ConfigurationManager
}

type ZenthclouddServer_PogsImpl struct {
	SessionManager_PogsImpl
	ConfigurationManager_PogsImpl
}

func ZenthclouddServer_ServerToClient(s SessionManager, c ConfigurationManager) proto.ZenthclouddServer {
	return proto.ZenthclouddServer_ServerToClient(ZenthclouddServer_PogsImpl{
		SessionManager_PogsImpl:       SessionManager_PogsImpl{s},
		ConfigurationManager_PogsImpl: ConfigurationManager_PogsImpl{c},
	})
}

type ZenthclouddServer_PogsClient struct {
	SessionManager_PogsClient
	ConfigurationManager_PogsClient
	Client capnp.Client
	Conn   *rpc.Conn
}

func NewZenthclouddServer_PogsClient(client capnp.Client, conn *rpc.Conn) ZenthclouddServer_PogsClient {
	sessionManagerClient := SessionManager_PogsClient{
		Client: client,
		Conn:   conn,
	}
	configManagerClient := ConfigurationManager_PogsClient{
		Client: client,
		Conn:   conn,
	}
	return ZenthclouddServer_PogsClient{
		SessionManager_PogsClient:       sessionManagerClient,
		ConfigurationManager_PogsClient: configManagerClient,
		Client:                          client,
		Conn:                            conn,
	}
}

func (c ZenthclouddServer_PogsClient) Close() error {
	c.Client.Close()
	return c.Conn.Close()
}
