import { Component } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div style="padding:2rem">
      <h1>Back Office — Peintures</h1>
      <nav style="display:flex;gap:1rem;margin:1rem 0">
        <a routerLink="tableaux">Tableaux</a>
        <a routerLink="textes">Textes du site</a>
      </nav>
      <p>Vous êtes connecté.</p>
      <button (click)="logout()">Se déconnecter</button>
    </div>
  `
})
export class AdminDashboardComponent {
  constructor(private authService: AuthService) {}
  logout(): void { this.authService.logout().subscribe(); }
}
