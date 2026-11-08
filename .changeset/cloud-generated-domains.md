---
"@guilderia/server": minor
"@guilderia/app": minor
---

Add guilderia Cloud generated hostnames: applications deployed on managed Cloud
receive a stable `<application>.guilderia.app` URL. Allocation is atomic (unique
hostname index with collision suffixes), survives redeployments, is routed
through the existing Traefik file provider and provisioned over HTTPS. The
central `*.guilderia.app` wildcard is bootstrapped through the Cloudflare API with
a scoped token, and released hostnames are kept as tombstones so a name can
never be reused by another tenant.
