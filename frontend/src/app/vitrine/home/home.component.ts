import { Component, OnInit } from '@angular/core';
import { VitrineTableau, VitrineTableauService } from '../services/vitrine-tableau.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tableaux: VitrineTableau[] = [];
  editingTableauId: number | null = null;

  constructor(private vitrineService: VitrineTableauService) {}

  ngOnInit(): void {
    this.loadTableaux();
  }

  loadTableaux(): void {
    this.vitrineService.getVisible().subscribe({
      next: (data) => { this.tableaux = data; }
    });
  }

  onEditRequested(id: number): void {
    this.editingTableauId = id;
  }

  onModalClosed(saved: boolean): void {
    this.editingTableauId = null;
    if (saved) {
      this.loadTableaux();
    }
  }
}
