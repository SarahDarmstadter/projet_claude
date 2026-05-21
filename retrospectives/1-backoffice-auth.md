# Retrospective: Feature #1 — Authentification Back Office

**Branch**: `feature/backoffice-auth`
**Date**: 2026-05-21

## What Went Well

- _À remplir en fin de feature_

## What Could Improve

- _À remplir en fin de feature_

## Lessons Learned

1. _À remplir en fin de feature_

## Changes Made

- `backend/src/main/resources/db/migration/V1__create_auth_tables.sql`: Migration Flyway — tables admin_users, mfa_codes, password_reset_tokens
- `backend/src/main/java/.../AuthController.java`: Endpoints d'authentification (login, 2FA, logout, refresh, reset)
- `frontend/src/app/auth/`: Module Angular — pages login, 2FA, reset password, guard, intercepteur JWT

## Metrics

- **Files modified**: 0
- **Files created**: _À compléter_
