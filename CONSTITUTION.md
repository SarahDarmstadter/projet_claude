# Project Constitution — Solo / Production

**SDLC option:** solo  
**Level:** production  
**Project:** Site vitrine de peintures avec back office d'administration  
**Stack:** Java / Spring Boot · Angular · PostgreSQL · Docker · MinIO

---

## Article 1 — Working principles

1. One contributor owns all decisions; velocity beats consensus overhead.
2. Every piece of production code is reviewed by the author before commit (`/sdlc-core:validate --quick`).
3. No branch stays open longer than 48 hours; small PRs are mandatory.

## Article 2 — Definition of done

A feature is done when:

- [ ] Unit tests pass
- [ ] `/sdlc-core:validate --quick` passes with no errors
- [ ] The feature works end-to-end in a local Docker Compose environment
- [ ] A brief entry is added to `CHANGELOG.md`

## Article 3 — Technical debt policy

Zero-tolerance: no TODO, FIXME, or hack comment may be committed without a linked issue. Debt identified during a feature is fixed in the same branch.

## Article 4 — Branching model

```
main          — production-ready, protected
feature/<name> — one feature per branch, merged via PR
fix/<name>    — bug fixes, same rule
```

## Article 5 — Deployment gate

Code is deployable only when:
1. All tests pass in CI
2. Docker images build without warnings
3. Database migrations are backwards-compatible or gated behind a flag

## Article 6 — Security baseline

- No secrets in source control (`.env` is gitignored; use `.env.example`)
- MinIO credentials rotated before production go-live
- PostgreSQL accessible only from within the Docker network

## Article 7 — Knowledge base

Architectural decisions that are non-obvious are documented via `/sdlc-knowledge-base:kb-ingest` so future-me has the reasoning, not just the outcome.
