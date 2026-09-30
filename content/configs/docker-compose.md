---
title: Docker Compose service
description: A production-ready baseline for a single service — healthcheck, restart policy, resource limits, secrets.
category: Containers
updated: 2026-09-30
tags: [docker]
---

*Example config — replace with your own.*

```yaml
services:
  app:
    image: ghcr.io/me/app:1.4.2        # pin versions, never :latest
    restart: unless-stopped
    env_file: .env                     # secrets stay out of git
    read_only: true
    user: "1000:1000"                  # don't run as root
    deploy:
      resources:
        limits: { cpus: "1.0", memory: 512M }
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }
```

## Why each choice

- **Pinned image tag** — reproducible deploys and easy rollbacks.
- **`read_only` + non-root user** — limits the blast radius if the app is compromised.
- **Healthcheck** — lets `restart` and orchestrators detect a hung process, not just a crashed one.
- **Log rotation** — the default json-file driver grows forever.
