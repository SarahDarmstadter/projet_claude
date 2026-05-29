import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { VitrineTableau, VitrineTableauService } from '../../services/vitrine-tableau.service';

@Component({
  selector: 'app-oeuvre-detail',
  templateUrl: './oeuvre-detail.component.html',
  styleUrls: ['./oeuvre-detail.component.css']
})
export class OeuvreDetailComponent implements OnInit {
  tableau: VitrineTableau | null = null;
  prev: VitrineTableau | null = null;
  next: VitrineTableau | null = null;
  related: VitrineTableau[] = [];
  total = 0;
  loading = true;
  isLightboxOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vitrineService: VitrineTableauService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.load(id);
    });
  }

  private load(id: number): void {
    this.loading = true;
    this.isLightboxOpen = false;
    this.vitrineService.getVisible().subscribe({
      next: (tableaux) => {
        this.total = tableaux.length;
        const idx = tableaux.findIndex(t => t.id === id);
        if (idx === -1) { this.router.navigate(['/oeuvres']); return; }
        this.tableau = tableaux[idx];
        this.prev = idx > 0 ? tableaux[idx - 1] : null;
        this.next = idx < tableaux.length - 1 ? tableaux[idx + 1] : null;
        this.related = tableaux.filter(
          t => t.id !== id && t.type?.id === this.tableau!.type?.id
        ).slice(0, 3);
        this.loading = false;
      },
      error: () => this.router.navigate(['/oeuvres'])
    });
  }

  openLightbox(): void  { this.isLightboxOpen = true; }
  closeLightbox(): void { this.isLightboxOpen = false; }

  get statutLabel(): string {
    switch (this.tableau?.statut) {
      case 'disponible':    return 'Disponible';
      case 'vendu':         return 'Vendu';
      case 'non_a_vendre':  return 'Collection privée';
      default:              return '';
    }
  }

  get dimensions(): string {
    const t = this.tableau;
    if (!t?.largeur && !t?.hauteur) return '';
    return `${t.largeur ?? '?'} × ${t.hauteur ?? '?'} cm`;
  }
}
