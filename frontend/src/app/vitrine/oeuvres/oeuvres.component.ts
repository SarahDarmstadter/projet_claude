import { Component, OnInit } from '@angular/core';
import { VitrineTableau, VitrineTableauService } from '../services/vitrine-tableau.service';
import { TexteService } from '../services/texte.service';

@Component({
  selector: 'app-oeuvres',
  templateUrl: './oeuvres.component.html',
  styleUrls: ['./oeuvres.component.css']
})
export class OeuvresComponent implements OnInit {
  tableaux: VitrineTableau[] = [];
  loadingImages: Record<number, boolean> = {};

  constructor(private vitrineService: VitrineTableauService, public textes: TexteService) {}

  ngOnInit(): void {
    this.vitrineService.getVisible().subscribe({
      next: (data) => {
        this.tableaux = data;
        data.forEach(t => { this.loadingImages[t.id] = true; });
      }
    });
  }

  onImageLoad(id: number): void {
    this.loadingImages[id] = false;
  }
}
