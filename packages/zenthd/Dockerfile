# use a builder image for building zenthcloud
ARG TARGET_GOOS
ARG TARGET_GOARCH
FROM golang:1.27.3 AS builder
ARG TARGET_GOOS
ARG TARGET_GOARCH
ARG GOPROXY=https://athens.cfdata.org|https://proxy.golang.org|direct
ENV GO111MODULE=on \
  CGO_ENABLED=0 \
  GOPROXY=${GOPROXY} \
  TARGET_GOOS=${TARGET_GOOS} \
  TARGET_GOARCH=${TARGET_GOARCH} \
  # the CONTAINER_BUILD envvar is used set github.com/skygenesisenterprise/zenthcloud/zenthcloudd/metrics.Runtime=virtual
  # which changes how zenthcloudd binds the metrics server
  CONTAINER_BUILD=1


WORKDIR /go/src/github.com/skygenesisenterprise/zenthcloud/zenthcloudd/

# Download dependencies in their own layer so source-only changes reuse it.
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# compile zenthcloudd
RUN make zenthcloudd

# use a distroless base image with glibc
FROM gcr.io/distroless/base-debian13:nonroot@sha256:f9518b74815721f537a7458cc693b4406208c04fce23bbffab511516117f34fd

LABEL org.opencontainers.image.source="https://github.com/skygenesisenterprise/zenthcloud"

# copy our compiled binary
COPY --from=builder --chown=nonroot /go/src/github.com/skygenesisenterprise/zenthcloud/zenthcloudd/zenthcloudd /usr/local/bin/

# run as nonroot user
# We need to use numeric user id's because Kubernetes doesn't support strings:
# https://github.com/kubernetes/kubernetes/blob/v1.33.2/pkg/kubelet/kuberuntime/security_context_others.go#L49
# The `nonroot` user maps to `65532`, from: https://github.com/GoogleContainerTools/distroless/blob/main/common/variables.bzl#L18
USER 65532:65532

# disable autoupdate: images are updated by pulling a new tag, not by replacing the binary in place.
# set as an env var rather than an entrypoint flag, so it still applies when the entrypoint is overridden.
ENV NO_AUTOUPDATE=true

# command / entrypoint of container
ENTRYPOINT ["zenthcloudd"]
CMD ["version"]
