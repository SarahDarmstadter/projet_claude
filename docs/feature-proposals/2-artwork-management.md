# Feature Proposal: Artwork Management

**Proposal Number:** 2
**Status:** In Progress
**Author:** Claude (AI Agent)
**Created:** 2026-05-22
**Target Branch:** `feature/artwork-management`

---

## Executive Summary

CRUD complet pour la gestion des tableaux (Tableau) et de leurs types (Type) dans le back office. Inclut l'upload d'image, le tri par drag & drop, les statuts, la visibilité publique, et la contrainte d'intégrité sur la suppression des types.

---

## Motivation

### Problem Statement

L'admin a besoin de gérer le catalogue de tableaux depuis le back office : ajouter, modifier, supprimer des œuvres avec leurs métadonnées, et contrôler lesquelles sont visibles sur le site public.

### User Stories

- En tant qu'admin, je veux créer un tableau avec image, titre, dimensions, type, période, prix, description, statut et visibilité pour alimenter le catalogue.
- En tant qu'admin, je veux modifier un tableau existant (y compris remplacer ou conserver son image) pour corriger ou enrichir les informations.
- En tant qu'admin, je veux supprimer un tableau avec confirmation modale pour éviter les suppressions accidentelles.
- En tant qu'admin, je veux réordonner les tableaux par drag & drop pour contrôler l'ordre d'affichage public.
- En tant qu'admin, je veux gérer les types de tableaux (créer, renommer, supprimer) pour maintenir la liste à jour.
- En tant que visiteur, je veux voir uniquement les tableaux `visible = true` triés par `ordre` pour parcourir le catalogue.

---

## Proposed Solution

1. **Backend — entités et migrations Flyway**
   - `Type` : id, nom (unique), created_at
   - `Tableau` : id, image_path, titre, largeur, hauteur, type_id (FK), periode, prix, description, statut (enum), visible, ordre, created_at, updated_at
   - Migration V3 : tables `types` et `tableaux`

2. **Backend — API REST (Spring Boot)**
   - `GET/POST /api/admin/types` — liste et création
   - `PUT/DELETE /api/admin/types/{id}` — modification et suppression (avec garde si tableau associé)
   - `GET/POST /api/admin/tableaux` — liste paginée et création (multipart/form-data pour image)
   - `PUT /api/admin/tableaux/{id}` — modification (image optionnelle)
   - `DELETE /api/admin/tableaux/{id}` — suppression avec confirmation côté client
   - `PATCH /api/admin/tableaux/order` — mise à jour de l'ordre par lot
   - `GET /api/public/tableaux` — tableaux visibles triés par ordre (sans auth)

3. **Frontend — Angular 17**
   - Module `TableauModule` lazy-loaded
   - Page liste : table avec miniature, titre, statut, colonne ordre drag & drop (CDK)
   - Page formulaire : création et édition (prévisualisation image, tous les champs)
   - Modal de confirmation avant suppression
   - Sous-page Types : CRUD simple

4. **Stockage images**
   - Upload vers un dossier local `/uploads` (volume Docker en dev)
   - Nommage UUID pour éviter les collisions
   - Endpoint public `GET /uploads/{filename}` servi par nginx

### Acceptance Criteria

- Créer un tableau avec image → visible dans la liste avec miniature
- Éditer sans changer l'image → image précédente conservée
- Drag & drop d'un tableau → ordre persisté en base
- Supprimer un type utilisé par un tableau → refus avec message d'erreur
- Visiteur sur `/api/public/tableaux` → uniquement les tableaux `visible = true`

---

## Success Criteria

- [ ] CRUD Tableau fonctionnel (create, read, update, delete)
- [ ] CRUD Type fonctionnel avec garde de suppression
- [ ] Upload image avec prévisualisation et conservation si non modifiée
- [ ] Drag & drop ordre persisté en base
- [ ] Endpoint public filtré sur `visible = true`
- [ ] Accès back office protégé par AuthGuard (JWT)

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Taille des fichiers image | Saturation disque | Limite de taille côté Spring (10 MB) + nommage UUID |
| Drag & drop complexe | Régression UX | Utiliser Angular CDK DragDrop, tester sur Chrome |
| Ordre concurrent | Désynchronisation | PATCH order reçoit le tableau complet des IDs ordonnés |

---

## Changes Made

| Action | File |
|--------|------|
| Create | `backend/src/main/resources/db/migration/V3__tableaux.sql` |
| Create | `backend/src/main/java/.../model/Type.java` |
| Create | `backend/src/main/java/.../model/Tableau.java` |
| Create | `backend/src/main/java/.../repository/TypeRepository.java` |
| Create | `backend/src/main/java/.../repository/TableauRepository.java` |
| Create | `backend/src/main/java/.../service/TableauService.java` |
| Create | `backend/src/main/java/.../service/TypeService.java` |
| Create | `backend/src/main/java/.../controller/TableauController.java` |
| Create | `backend/src/main/java/.../controller/TypeController.java` |
| Create | `frontend/src/app/admin/tableau/` (module, composants, service) |
