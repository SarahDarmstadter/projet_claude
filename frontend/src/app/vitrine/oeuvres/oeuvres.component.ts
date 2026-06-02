import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { VitrineTableau, VitrineTableauService } from '../services/vitrine-tableau.service';
import { TexteService } from '../services/texte.service';

@Component({
  selector: 'app-oeuvres',
  templateUrl: './oeuvres.component.html',
  styleUrls: ['./oeuvres.component.css']
})
export class OeuvresComponent implements OnInit {
  tableaux: VitrineTableau[] = [];
  types: { id: number; nom: string }[] = [];
  selectedTypeId: number | null = null;
  loadingImages: Record<number, boolean> = {};

  constructor(
    private vitrineService: VitrineTableauService,
    public textes: TexteService,
    private titleService: Title,
    private meta: Meta
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
      }
    });
  }

  setFilter(id: number | null): void {
    this.selectedTypeId = id;
  }

  get filteredTableaux(): VitrineTableau[] {
    if (!this.selectedTypeId) return this.tableaux;
    return this.tableaux.filter(t => t.type?.id === this.selectedTypeId);
  }

  onImageLoad(id: number): void {
    this.loadingImages[id] = false;
  }
}
