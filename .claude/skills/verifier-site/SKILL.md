---
description: Recette complète du site peintures.local — 16 tests Playwright couvrant vitrine, navigation, galerie, contact, admin et mobile
---

# verifier-site

Lance la recette complète via Playwright Docker. **16 tests, ~25 secondes.**

## Prérequis

L'app doit tourner : `docker compose up -d` depuis la racine du projet.

## Lancer la recette

```bash
docker run --rm \
  --network host \
  -v "$(pwd)/.claude/skills/verifier-site:/tests" \
  mcr.microsoft.com/playwright:v1.60.0-jammy \
  bash -c "cd /tests && npm install --save-dev @playwright/test@1.60.0 --silent 2>/dev/null; npx playwright test recette.spec.js --reporter=list"
```

> L'image Docker `mcr.microsoft.com/playwright:v1.60.0-jammy` doit être présente.
> Si elle manque : `docker pull mcr.microsoft.com/playwright:v1.60.0-jammy`

## Note importante — hash routing

L'app Angular utilise `useHash: true`. Toutes les routes sont sous `/#/xxx`.
Les tests utilisent `goto(page, '/#/xxx')` — ne pas utiliser `page.goto('/xxx')` directement.

## Ce qui est testé (16 tests)

| # | Zone | Flux |
|---|---|---|
| 1 | Vitrine | Accueil — hero visible |
| 2 | Vitrine | Accueil — galerie des dernières œuvres présente |
| 3 | Navigation | Clic Galerie dans le header → /oeuvres |
| 4 | Navigation | Clic Biographie → /artiste |
| 5 | Navigation | Clic Contact → /contact |
| 6 | Navigation | Logo → retour accueil |
| 7 | Galerie | Items chargent depuis l'API |
| 8 | Galerie | Clic sur une œuvre → détail |
| 9 | Contact | Formulaire visible, email artiste absent du HTML |
| 10 | Footer | "Contacter l'artiste" navigue vers /contact |
| 11 | Footer | Liens Galerie/Biographie/Contact ont un href |
| 12 | Vitrine | Route inconnue → 404 page introuvable |
| 13 | Admin | /admin/tableaux → redirige vers login (AuthGuard) |
| 14 | Admin | /admin/textes → redirige vers login (AuthGuard) |
| 15 | Mobile | Header et hamburger visibles à 375px |
| 16 | Mobile | Menu hamburger ouvre et ferme |
