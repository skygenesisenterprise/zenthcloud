package selfsign

import (
	"testing"

	"github.com/skygenesisenterprise/zenthcloud/cfssl/cli"
)

func TestSelfSignMain(t *testing.T) {
	err := selfSignMain([]string{"zenthcloud.com", "../../testdata/csr.json"}, cli.Config{Hostname: ""})
	if err != nil {
		t.Fatal(err)
	}
}

func TestBadSelfSignMain(t *testing.T) {
	err := selfSignMain([]string{"zenthcloud.com"}, cli.Config{Hostname: ""})
	if err == nil {
		t.Fatal("No CSR, should report error")
	}

	err = selfSignMain([]string{}, cli.Config{Hostname: ""})
	if err == nil {
		t.Fatal("No server, should report error")
	}

	err = selfSignMain([]string{"zenthcloud.com", "../../testdata/garbage.key"}, cli.Config{Hostname: ""})
	if err == nil {
		t.Fatal("Wrong CSR file, should report error")
	}
}
