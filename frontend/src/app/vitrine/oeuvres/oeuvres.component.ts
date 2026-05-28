import { Component, OnInit } from '@angular/core';
import { VitrineTableau, VitrineTableauService } from '../services/vitrine-tableau.service';

export interface GalleryBlock {
  featured: VitrineTableau;
  stacked: VitrineTableau[];
  small: VitrineTableau[];
}

@Component({
  selector: 'app-oeuvres',
  templateUrl: './oeuvres.component.html',
  styleUrls: ['./oeuvres.component.css']
})
export class OeuvresComponent implements OnInit {
  tableaux: VitrineTableau[] = [];
  blocks: GalleryBlock[] = [];

  constructor(private vitrineService: VitrineTableauService) {}

  ngOnInit(): void {
    this.vitrineService.getVisible().subscribe({
      next: (data) => {
        this.tableaux = data;
        this.blocks = this.buildBlocks(data);
      }
    });
  }

  private buildBlocks(tableaux: VitrineTableau[]): GalleryBlock[] {
    const result: GalleryBlock[] = [];
    let i = 0;
    while (i < tableaux.length) {
      const featured = tableaux[i];
      const stacked = tableaux.slice(i + 1, i + 3);
      const small = tableaux.slice(i + 3, i + 6);
      result.push({ featured, stacked, small });
      i += 1 + stacked.length + small.length;
    }
    return result;
  }
}
