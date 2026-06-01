import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <app-heading></app-heading>
    <div class="not-found">
      <p class="not-found-code">404</p>
      <h1 class="not-found-title">Page introuvable</h1>
      <p class="not-found-desc">Cette page n'existe pas ou a été déplacée.</p>
      <a routerLink="/" class="not-found-link">← Retour à l'accueil</a>
    </div>
    <app-page-bottom></app-page-bottom>
  `,
  styles: [`
    .not-found {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: calc(100vh - 128px);
      padding: 64px 24px;
      text-align: center;
      font-family: 'Inter', sans-serif;
    }
    .not-found-code {
      font-family: 'Playfair Display', serif;
      font-size: clamp(80px, 15vw, 140px);
      font-weight: 300; color: #e8e8e8;
      line-height: 1; margin-bottom: 8px;
    }
    .not-found-title {
      font-family: 'Playfair Display', serif;
      font-size: 28px; font-weight: 400; color: #111;
      margin-bottom: 16px;
    }
    .not-found-desc {
      font-family: 'Cormorant Garamond', serif;
      font-size: 18px; color: #888; margin-bottom: 48px;
    }
    .not-found-link {
      font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
      color: #111; text-decoration: none;
      border-bottom: 1px solid #111; padding-bottom: 3px;
      transition: opacity .2s;
    }
    .not-found-link:hover { opacity: .5; }
  `]
})
export class NotFoundComponent {}
