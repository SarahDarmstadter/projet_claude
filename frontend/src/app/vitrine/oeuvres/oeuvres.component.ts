import { Component, OnInit } from '@angular/core';
import { VitrineTableau, VitrineTableauService } from '../services/vitrine-tableau.service';

@Component({
  selector: 'app-oeuvres',
  templateUrl: './oeuvres.component.html',
  styles: [`
    .page-content { padding: 5% 5%; font-family: 'OldStandardTT-Regular', serif; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px; margin-top: 2%; }
    .card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
    .card-title { font-size: 0.9em; margin-top: 6px; }
  `]
})
export class OeuvresComponent implements OnInit {
  tableaux: VitrineTableau[] = [];

  constructor(private vitrineService: VitrineTableauService) {}

  ngOnInit(): void {
    this.vitrineService.getVisible().subscribe({
      next: (data) => { this.tableaux = data; }
    });
  }
}
