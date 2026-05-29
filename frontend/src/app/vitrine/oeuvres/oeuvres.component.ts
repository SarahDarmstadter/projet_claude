import { Component, OnInit } from '@angular/core';
import { VitrineTableau, VitrineTableauService } from '../services/vitrine-tableau.service';

@Component({
  selector: 'app-oeuvres',
  templateUrl: './oeuvres.component.html',
  styleUrls: ['./oeuvres.component.css']
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
