# Base digest refresh: skopeo inspect docker://docker.io/library/debian:trixie | jq -r .Digest
FROM debian:trixie@sha256:fac46bff2e02f51425b6e33b0e1169f55dfb053d83511ca28aa50c09fd5ed7a4

ENV DEBIAN_FRONTEND=noninteractive

ARG USERNAME="dev"
ENV USER=$USERNAME

# Checksums: https://nodejs.org/dist/v<NODE_VERSION>/SHASUMS256.txt
ARG NODE_VERSION="24.18.1"
ARG NODE_SHA256_X64="d6c664df3f3f61458e8c277585571328522d705166723a7c7823a9253a4d15a0"
ARG NODE_SHA256_ARM64="7201e3a09dc825bac57867c81913e2b8f0ef87d04cb9082af4cda82f6ff3d88c"
ARG PNPM_VERSION="11.18.0"

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    less \
    openssh-client \
    procps \
    ripgrep \
    sudo \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

# Official tarball rather than apt/nodesource, so the build is pinned by checksum.
RUN set -eux; \
    arch="$(dpkg --print-architecture)"; \
    case "$arch" in \
      amd64) node_arch="x64";   node_sha="${NODE_SHA256_X64}" ;; \
      arm64) node_arch="arm64"; node_sha="${NODE_SHA256_ARM64}" ;; \
      *) echo "unsupported architecture: $arch" >&2; exit 1 ;; \
    esac; \
    tarball="node-v${NODE_VERSION}-linux-${node_arch}.tar.xz"; \
    curl -fsSLO "https://nodejs.org/dist/v${NODE_VERSION}/${tarball}"; \
    echo "${node_sha}  ${tarball}" | sha256sum -c -; \
    tar -xJf "${tarball}" -C /usr/local --strip-components=1 --no-same-owner; \
    rm "${tarball}"; \
    node --version && npm --version

RUN npm install -g "pnpm@${PNPM_VERSION}" && npm cache clean --force

RUN adduser --disabled-password --gecos '' $USER \
    && adduser $USER sudo \
    && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER $USER
ENV PNPM_HOME="/home/$USER/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Vite binds 127.0.0.1 by default, unreachable from the host.
ENV VITE_HOST=0.0.0.0
