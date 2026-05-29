import { Component, OnInit } from '@angular/core';
import { VitrineTableau, VitrineTableauService } from '../services/vitrine-tableau.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tableaux: VitrineTableau[] = [];

  constructor(private vitrineService: VitrineTableauService) {}

  ngOnInit(): void {
    this.vitrineService.getVisible().subscribe({
      next: (data) => { this.tableaux = data; }
    });
  }

  get latestTableaux(): VitrineTableau[] {
    return [...this.tableaux].sort((a, b) => b.id - a.id).slice(0, 3);
  }
}
