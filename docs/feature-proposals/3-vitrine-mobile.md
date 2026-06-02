# Feature Proposal: Vitrine Mobile

**Proposal Number:** 3
**Status:** In Progress
**Author:** Claude (AI Agent)
**Created:** 2026-06-02
**Target Branch:** `feature/vitrine-mobile`

---

## Executive Summary

Adapter la vitrine publique (Pierre Darmstadter) pour les appareils mobiles : navigation, home, galerie, détail œuvre, biographie et contact. La version desktop est complète (feature #3 desktop). Cette feature implémente les recommandations de l'agent UX/UI produites lors de l'audit de la feature vitrine.

---

## Motivation

### Problem Statement

La vitrine est actuellement navigable sur desktop. Sur mobile (375–768px) plusieurs problèmes bloquants existent : overlay hover invisible au touch sur le slider, zones tactiles insuffisantes (< 44px), lightbox sans safe area, navigation prev/next oeuvre trop étroite, tailles de texte sous le seuil de lisibilité.

### User Stories

- En tant que visiteur sur mobile, je veux pouvoir naviguer dans la galerie et accéder au détail des œuvres sans friction.
- En tant que visiteur sur iPhone, je veux que la lightbox soit bien dimensionnée et que le bouton fermer respecte l'encoche.
- En tant qu'admin sur mobile, je veux accéder aux fonctions d'édition depuis le FAB.

---

## Proposed Solution

Implémenter les recommandations prioritaires de l'agent UX/UI (audit du 2026-06-02) :

### Priorité haute
- **HeadingComponent** : animation ouverture menu (max-height + opacity), zone tactile hamburger ≥ 44px
- **HomeComponent** : intégrer `SliderMobileComponent` en dessous de 768px (actuellement le slider desktop est rendu sur mobile, overlay hover invisible)
- **HomeComponent** : CTA hero pleine largeur + min-height 44px sur mobile
- **OeuvreDetailComponent** : specs grid 1 colonne sous 480px, navigation prev/next en colonne pleine largeur, lightbox safe area (`env(safe-area-inset-*)`)
- **ContactComponent** : btn-send pleine largeur, focus indicator contraste suffisant (WCAG)
- **OeuvresComponent** : item-title 14px min, item-meta 11px min

### Priorité moyenne
- **SliderMobileComponent** : remplacer height fixe par aspect-ratio 4/3
- **OeuvreDetailComponent** : `SwipeDirective` réutilisable pour navigation swipe entre œuvres
- **ContactComponent** : marges formulaire réduites sur mobile
- **PageBottomComponent** : safe area `padding-bottom`

### Priorité basse
- Bouton retour en haut (galerie longue)
- Indicateur actif `border-left` dans le menu mobile
- Dots conditionnel SliderMobile (> 7 œuvres)

---

## Technical Approach

- CSS responsive exclusivement (pas de framework)
- Breakpoints : 768px (tablette/mobile), 640px (petit mobile), 480px (très petit), 390px (iPhone standard)
- `@media (hover: none)` pour les adaptations touch
- `SwipeDirective` extraite du SliderMobileComponent existant
- `BreakpointObserver` Angular pour le switch slider desktop/mobile dans HomeComponent

---

## Out of Scope

- Refonte visuelle (seul le responsive est concerné)
- PWA / service worker
- Tests automatisés E2E mobile
