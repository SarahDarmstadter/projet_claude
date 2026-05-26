import { Component, OnInit } from '@angular/core';
import { VitrineTableau, VitrineTableauService } from '../services/vitrine-tableau.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tableaux: VitrineTableau[] = [];
  isDesktop = window.innerWidth >= 768;

  constructor(private vitrineService: VitrineTableauService) {}

  ngOnInit(): void {
    this.vitrineService.getVisible().subscribe({
      next: (data) => { this.tableaux = data; }
    });
  }
}
