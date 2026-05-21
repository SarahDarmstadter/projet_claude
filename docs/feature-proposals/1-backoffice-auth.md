# Feature Proposal: Système d'authentification sécurisé — Back Office

**Proposal Number:** 1
**Status:** In Progress
**Author:** Claude (AI Agent)
**Created:** 2026-05-21
**Target Branch:** `feature/backoffice-auth`

---

## Executive Summary

Mise en place du système d'authentification complet pour le back office d'administration du site vitrine de peintures. L'accès est réservé aux administrateurs (pas d'inscription publique). Le système inclut la création de compte admin, la connexion avec double authentification (2FA par email ou SMS), la gestion de sessions sécurisées, et la réinitialisation de mot de passe.

---

## Motivation

### Problem Statement

Le back office d'administration (gestion des œuvres, des catégories, des commandes) doit être protégé contre tout accès non autorisé. Un système d'authentification robuste est le prérequis de toutes les autres fonctionnalités d'administration.

### User Stories

- En tant qu'administrateur, je veux me connecter avec mon email + mot de passe + code 2FA pour accéder au back office de manière sécurisée.
- En tant qu'administrateur, je veux choisir entre recevoir mon code 2FA par email ou par SMS.
- En tant qu'administrateur, je veux réinitialiser mon mot de passe via un lien sécurisé envoyé par email.
- En tant que système, je veux verrouiller temporairement un compte après plusieurs tentatives de connexion échouées pour me protéger contre les attaques par force brute.

---

## Proposed Solution

### Backend (Spring Boot)

1. **Modèle de données**
   - Entité `AdminUser` : id, email, password_hash, mfa_method (EMAIL/SMS), phone_number, failed_attempts, locked_until, created_at
   - Entité `MfaCode` : id, admin_user_id, code_hash, expires_at, used (codes 2FA temporaires)
   - Entité `PasswordResetToken` : id, admin_user_id, token_hash, expires_at, used

2. **Sécurité des mots de passe**
   - Hashage avec BCrypt (strength 12) via Spring Security
   - Règles : minimum 12 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial

3. **Protection force brute**
   - Compteur `failed_attempts` incrémenté à chaque échec
   - Verrouillage temporaire 15 min après 5 tentatives échouées
   - Réinitialisation du compteur après connexion réussie

4. **Double authentification (2FA)**
   - Code à 6 chiffres, valable 10 minutes, usage unique
   - Livraison par email (Spring Mail) ou SMS (Twilio ou équivalent)
   - Code stocké hashé en base (BCrypt), effacé après usage ou expiration

5. **Gestion des sessions**
   - JWT signé (HS256), expiration 8h, stocké côté client en mémoire (pas localStorage)
   - Cookie HttpOnly + Secure + SameSite=Strict pour le refresh token (expiration 7j)
   - Endpoint de déconnexion révoquant le refresh token (liste noire en base ou Redis)

6. **Réinitialisation de mot de passe**
   - Token aléatoire (UUID v4), hashé en base, valable 1h
   - Email envoyé avec lien `https://.../#/reset-password?token=<token>`
   - Invalidation du token après usage ou expiration

7. **Endpoints REST**
   - `POST /api/auth/login` — étape 1 (email + password)
   - `POST /api/auth/verify-2fa` — étape 2 (code 2FA)
   - `POST /api/auth/logout` — révocation du refresh token
   - `POST /api/auth/refresh` — renouvellement du JWT
   - `POST /api/auth/forgot-password` — demande de reset
   - `POST /api/auth/reset-password` — application du nouveau mot de passe

### Frontend (Angular)

1. **Module `AuthModule`** avec guards et intercepteurs
2. **Pages** : LoginComponent, TwoFactorComponent, ForgotPasswordComponent, ResetPasswordComponent
3. **AuthGuard** bloquant les routes admin si non authentifié
4. **HttpInterceptor** ajoutant le JWT aux requêtes et gérant les 401

### Base de données (PostgreSQL)

- Tables : `admin_users`, `mfa_codes`, `password_reset_tokens`
- Index sur `admin_users.email` (unique), `mfa_codes.expires_at`, `password_reset_tokens.expires_at`
- Migration Flyway : `V1__create_auth_tables.sql`

### Acceptance Criteria

| Scénario | Résultat attendu |
|----------|-----------------|
| Login valide + 2FA correct | JWT retourné, session ouverte |
| Login valide + 2FA expiré | Erreur 401 "Code expiré" |
| 5 tentatives échouées | Compte verrouillé 15 min, message clair |
| Mot de passe < 12 chars | Refus à la création/modification |
| Token reset utilisé 2x | Erreur 400 "Token invalide" |
| Accès route admin sans JWT | Redirection vers /login |

---

## Success Criteria

- [ ] Un administrateur peut se créer un compte (en ligne de commande ou endpoint privé)
- [ ] La connexion en 2 étapes (password + 2FA) fonctionne pour email et SMS
- [ ] Le verrouillage de compte après 5 échecs est opérationnel
- [ ] Le flow de réinitialisation de mot de passe fonctionne de bout en bout
- [ ] Toutes les routes Angular du back office sont protégées par `AuthGuard`
- [ ] Les mots de passe sont hashés BCrypt (vérifiable en base)
- [ ] Les codes 2FA expirent après 10 minutes
- [ ] Les JWT expirent après 8h et les refresh tokens après 7j
- [ ] 0 secret en clair dans le code (variables d'environnement Spring)

---

## Risks

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Coût SMS (Twilio) en production | Faible | Démarrer avec email uniquement ; SMS optionnel |
| Fuite de JWT (XSS) | Élevé | JWT en mémoire uniquement, refresh en cookie HttpOnly |
| Bruteforce via `/forgot-password` | Moyen | Rate limiting sur l'endpoint (1 demande / 5 min par IP) |
| Expiration Redis pour liste noire JWT | Moyen | Alternative : timestamp `issued_before` sur l'utilisateur |

---

## Changes Made

| Action | Fichier |
|--------|---------|
| Créer | `backend/src/main/java/.../model/AdminUser.java` |
| Créer | `backend/src/main/java/.../model/MfaCode.java` |
| Créer | `backend/src/main/java/.../model/PasswordResetToken.java` |
| Créer | `backend/src/main/java/.../controller/AuthController.java` |
| Créer | `backend/src/main/java/.../service/AuthService.java` |
| Créer | `backend/src/main/java/.../service/MfaService.java` |
| Créer | `backend/src/main/java/.../security/JwtProvider.java` |
| Créer | `backend/src/main/resources/db/migration/V1__create_auth_tables.sql` |
| Créer | `frontend/src/app/auth/auth.module.ts` |
| Créer | `frontend/src/app/auth/login/login.component.ts` |
| Créer | `frontend/src/app/auth/two-factor/two-factor.component.ts` |
| Créer | `frontend/src/app/auth/forgot-password/forgot-password.component.ts` |
| Créer | `frontend/src/app/auth/guards/auth.guard.ts` |
| Créer | `frontend/src/app/auth/interceptors/jwt.interceptor.ts` |
