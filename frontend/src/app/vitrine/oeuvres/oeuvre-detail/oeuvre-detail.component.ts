import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, catchError, EMPTY } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { VitrineTableau, VitrineTableauService } from '../../services/vitrine-tableau.service';

@Component({
  selector: 'app-oeuvre-detail',
  templateUrl: './oeuvre-detail.component.html',
  styleUrls: ['./oeuvre-detail.component.css']
})
export class OeuvreDetailComponent implements OnInit, OnDestroy {
  tableau: VitrineTableau | null = null;
  prev: VitrineTableau | null = null;
  next: VitrineTableau | null = null;
  related: VitrineTableau[] = [];
  total = 0;
  loading = true;
  isLightboxOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vitrineService: VitrineTableauService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (isNaN(id)) {
          this.router.navigate(['/oeuvres']);
          return EMPTY;
        }
        this.loading = true;
        this.isLightboxOpen = false;
        return this.vitrineService.getVisible().pipe(
          switchMap(tableaux => [{ id, tableaux }]),
          catchError(() => {
            this.router.navigate(['/oeuvres']);
            return EMPTY;
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ id, tableaux }) => {
        this.total = tableaux.length;
        const idx = tableaux.findIndex(t => t.id === id);
        if (idx === -1) {
          this.loading = false;
          this.router.navigate(['/oeuvres']);
          return;
        }
        this.tableau = tableaux[idx];
        this.prev = idx > 0 ? tableaux[idx - 1] : null;
        this.next = idx < tableaux.length - 1 ? tableaux[idx + 1] : null;
        const typeId = this.tableau.type?.id;
        this.related = typeId != null
          ? tableaux.filter(t => t.id !== id && t.type?.id === typeId).slice(0, 3)
          : [];
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
