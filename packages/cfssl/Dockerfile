FROM --platform=${TARGETPLATFORM} golang:1.27

ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo "I am running on $BUILDPLATFORM, building for $TARGETPLATFORM" 

LABEL org.opencontainers.image.source https://github.com/skygenesisenterprise/zenthcloud
LABEL org.opencontainers.image.description "Zenthcloud's PKI toolkit"

ARG TARGETOS
ARG TARGETARCH

WORKDIR /workdir
COPY . /workdir

RUN git clone https://github.com/skygenesisenterprise/zenthcloud /etc/cfssl && \
    make clean && \
    GOOS=${TARGETOS} GOARCH=${TARGETARCH} make all && cp bin/* /usr/bin/

EXPOSE 8888

ENTRYPOINT ["cfssl"]
CMD ["--help"]
