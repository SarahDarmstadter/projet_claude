import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { TexteService } from '../../services/texte.service';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent {
  menuOpen = false;
  navOpen = false;

  constructor(public auth: AuthService, private router: Router, public textes: TexteService) {}

  get isMobileNavInert(): boolean {
    return !this.navOpen && window.innerWidth <= 768;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) this.menuOpen = false;
    if (!target.closest('.site-nav')) this.navOpen = false;
  }

  toggleNav(): void  { this.navOpen = !this.navOpen; }
  closeNav(): void   { this.navOpen = false; }
  toggleMenu(): void { this.menuOpen = !this.menuOpen; if (this.menuOpen) this.navOpen = false; }
  closeMenu(): void  { this.menuOpen = false; }

  logout(): void {
    this.auth.logout().subscribe({ complete: () => this.router.navigate(['/']) });
    this.menuOpen = false;
    this.navOpen = false;
  }
}
