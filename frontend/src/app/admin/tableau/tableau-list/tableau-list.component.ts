import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TableauService, TableauResponse } from '../tableau.service';

@Component({
  selector: 'app-tableau-list',
  templateUrl: './tableau-list.component.html'
})
export class TableauListComponent implements OnInit {
  tableaux: TableauResponse[] = [];
  loading = false;
  deleteTarget: TableauResponse | null = null;

  readonly imageBase = this.tableauService.imageBase;

  constructor(private tableauService: TableauService) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.tableauService.getAll().subscribe({
      next: (data) => {
        this.tableaux = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  drop(event: CdkDragDrop<TableauResponse[]>): void {
    moveItemInArray(this.tableaux, event.previousIndex, event.currentIndex);
    this.updateOrder();
  }

  updateOrder(): void {
    const items = this.tableaux.map((t, index) => ({ id: t.id, ordre: index + 1 }));
    this.tableauService.updateOrder(items).subscribe();
  }

  confirmDelete(t: TableauResponse): void {
    this.deleteTarget = t;
  }

  executeDelete(): void {
    if (!this.deleteTarget) return;
    const id = this.deleteTarget.id;
    this.deleteTarget = null;
    this.tableauService.delete(id).subscribe({
      next: () => this.load()
    });
  }

  cancelDelete(): void {
    this.deleteTarget = null;
  }
}
