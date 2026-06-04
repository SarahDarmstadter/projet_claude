// @ts-check
const { test, expect } = require('@playwright/test');

// L'app utilise Angular hash routing (useHash: true) — toutes les routes via /#/xxx
const BASE = 'http://peintures.local:8000';
test.use({ baseURL: BASE });

async function goto(page, path) {
  await page.goto(`/#${path}`);
  await page.waitForLoadState('networkidle');
}

// ── Vitrine ──────────────────────────────────────────────────────────────────

test('Accueil — hero visible', async ({ page }) => {
  await goto(page, '/');
  await expect(page.locator('.hero')).toBeVisible();
});

test('Accueil — galerie des dernières œuvres présente', async ({ page }) => {
  await goto(page, '/');
  await expect(page.locator('.carousel-item, .work-card').first()).toBeVisible();
});

test('Navigation — Galerie', async ({ page }) => {
  await goto(page, '/');
  await page.locator('.site-nav a', { hasText: 'Galerie' }).first().click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/oeuvres/);
  await expect(page.locator('.gallery-title').first()).toBeVisible();
});

test('Navigation — Biographie', async ({ page }) => {
  await goto(page, '/');
  await page.locator('.site-nav a', { hasText: 'Biographie' }).first().click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/artiste/);
  await expect(page.locator('body')).toContainText('Darmstadter');
});

test('Navigation — Contact', async ({ page }) => {
  await goto(page, '/');
  await page.locator('.site-nav a', { hasText: 'Contact' }).first().click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/contact/);
  await expect(page.locator('.contact-right')).toBeVisible();
});

test('Navigation — Retour Accueil via logo', async ({ page }) => {
  await goto(page, '/contact');
  await page.locator('.nav-logo').click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.hero')).toBeVisible();
});

test('Galerie — items chargent depuis l\'API', async ({ page }) => {
  await goto(page, '/oeuvres');
  await expect(page.locator('.gallery-item').first()).toBeVisible({ timeout: 15000 });
});

test('Galerie — clic sur une œuvre ouvre le détail', async ({ page }) => {
  await goto(page, '/oeuvres');
  const firstItem = page.locator('.gallery-item').first();
  await expect(firstItem).toBeVisible({ timeout: 15000 });
  await firstItem.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/oeuvres\/\d+/);
});

test('Page Contact — formulaire visible, email artiste absent', async ({ page }) => {
  await goto(page, '/contact');
  await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('input#email')).toBeVisible();
  const body = await page.locator('body').textContent();
  expect(body).not.toContain('pierre.darmstadter@gmail.com');
});

test('Footer — "Contacter l\'artiste" navigue vers /contact', async ({ page }) => {
  await goto(page, '/');
  await page.locator('.footer-email', { hasText: /Contacter/i }).click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/contact/);
});

test('Footer — liens de navigation ont un href', async ({ page }) => {
  await goto(page, '/');
  for (const label of ['Galerie', 'Biographie', 'Contact']) {
    const link = page.locator('.footer-nav a', { hasText: label });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
  }
});

test('404 — route inconnue affiche page introuvable', async ({ page }) => {
  await goto(page, '/cette-page-nexiste-pas');
  await expect(page.locator('body')).toContainText(/404|introuvable/i);
});

// ── Admin ─────────────────────────────────────────────────────────────────────

test('Admin /tableaux — redirige vers login si non authentifié', async ({ page }) => {
  await goto(page, '/admin/tableaux');
  // AuthGuard redirige vers /auth/login → formulaire de connexion visible
  await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible({ timeout: 10000 });
});

test('Admin /textes — redirige vers login si non authentifié', async ({ page }) => {
  await goto(page, '/admin/textes');
  await expect(page.locator('input[type="email"], input[type="text"]').first()).toBeVisible({ timeout: 10000 });
});

// ── Responsive ───────────────────────────────────────────────────────────────

test('Mobile — header et hamburger visibles (375px)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await goto(page, '/');
  await expect(page.locator('.site-nav')).toBeVisible();
  await expect(page.locator('.nav-hamburger')).toBeVisible();
});

test('Mobile — menu hamburger ouvre et ferme', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await goto(page, '/');
  const hamburger = page.locator('.nav-hamburger');
  await hamburger.click();
  await expect(page.locator('.nav-links--open')).toBeVisible();
  await hamburger.click();
  await expect(page.locator('.nav-links--open')).not.toBeVisible();
});
