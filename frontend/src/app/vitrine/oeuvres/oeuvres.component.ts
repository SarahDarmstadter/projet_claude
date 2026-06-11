import { Component, OnInit, OnDestroy, HostListener, NgZone } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { VitrineTableau, VitrineTableauService } from '../services/vitrine-tableau.service';
import { TexteService } from '../services/texte.service';

@Component({
  selector: 'app-oeuvres',
  templateUrl: './oeuvres.component.html',
  styleUrls: ['./oeuvres.component.css']
})
export class OeuvresComponent implements OnInit, OnDestroy {
  tableaux: VitrineTableau[] = [];
  types: { id: number; nom: string }[] = [];
  selectedTypeId: number | null = null;
  loadingImages: Record<number, boolean> = {};
  showScrollTop = false;
  private revealObserver?: IntersectionObserver;

  constructor(
    private vitrineService: VitrineTableauService,
    public textes: TexteService,
    private titleService: Title,
    private meta: Meta,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Galerie — Pierre Darmstadter');
    this.meta.updateTag({ name: 'description', content: 'Découvrez la galerie de peintures de Pierre Darmstadter — huiles sur toile, aquarelles et œuvres récentes.' });
    this.meta.updateTag({ property: 'og:title', content: 'Galerie — Pierre Darmstadter' });
    this.meta.updateTag({ property: 'og:description', content: 'Découvrez la galerie de peintures de Pierre Darmstadter — huiles sur toile, aquarelles et œuvres récentes.' });

    this.vitrineService.getVisible().subscribe({
      next: (data) => {
        this.tableaux = data;
        const seen = new Set<number>();
        this.types = data
          .filter(t => t.type !== null && !seen.has(t.type!.id) && seen.add(t.type!.id))
          .map(t => t.type!);
        data.forEach(t => { this.loadingImages[t.id] = true; });
        setTimeout(() => this.setupRevealObserver(), 50);
      }
    });
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }

  private setupRevealObserver(): void {
    this.revealObserver?.disconnect();
    this.ngZone.runOutsideAngular(() => {
      this.revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            this.revealObserver?.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.gallery-item').forEach(el => this.revealObserver!.observe(el));
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showScrollTop = window.scrollY > 600;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setFilter(id: number | null): void {
    this.selectedTypeId = id;
    setTimeout(() => this.setupRevealObserver(), 50);
  }

  get filteredTableaux(): VitrineTableau[] {
    if (!this.selectedTypeId) return this.tableaux;
    return this.tableaux.filter(t => t.type?.id === this.selectedTypeId);
  }

  onImageLoad(id: number): void {
    this.loadingImages[id] = false;
  }
}
