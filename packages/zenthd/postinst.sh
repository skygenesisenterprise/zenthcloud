#!/bin/bash
set -eu
ln -sf /usr/bin/zenthcloudd /usr/local/bin/zenthcloudd
mkdir -p /usr/local/etc/zenthcloudd/
touch /usr/local/etc/zenthcloudd/.installedFromPackageManager || true
