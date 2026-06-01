import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, Subscription, switchMap, catchError, EMPTY } from 'rxjs';
import { TableauService, TableauResponse } from '../tableau.service';
import { ToastService } from '../../shared/toast.service';
@Component({
  selector: 'app-tableau-list',
  templateUrl: './tableau-list.component.html'
})
export class TableauListComponent implements OnInit, OnDestroy {
  tableaux: TableauResponse[] = [];
  loading = false;
  deleteTarget: TableauResponse | null = null;

  readonly imageBase = this.tableauService.imageBase;

  private orderUpdate$ = new Subject<{ items: { id: number; ordre: number }[]; previous: TableauResponse[] }>();
  private orderSub!: Subscription;

  constructor(
    private tableauService: TableauService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.orderSub = this.orderUpdate$.pipe(
      switchMap(({ items, previous }) =>
        this.tableauService.updateOrder(items).pipe(
          catchError(() => {
            this.tableaux = previous;
            this.toastService.error("Erreur lors de la mise à jour de l'ordre");
            return EMPTY;
          })
        )
      )
    ).subscribe(() => this.toastService.success('Ordre mis à jour'));

    this.load();
  }

  ngOnDestroy(): void {
    this.orderSub.unsubscribe();
  }

  private load(): void {
    this.loading = true;
    this.tableauService.getAll().subscribe({
      next: (data) => { this.tableaux = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  drop(event: CdkDragDrop<TableauResponse[]>): void {
    const previous = [...this.tableaux];
    moveItemInArray(this.tableaux, event.previousIndex, event.currentIndex);
    const items = this.tableaux.map((t, index) => ({ id: t.id, ordre: index + 1 }));
    this.orderUpdate$.next({ items, previous });
  }

  confirmDelete(t: TableauResponse): void {
    this.deleteTarget = t;
  }

  executeDelete(): void {
    if (!this.deleteTarget) return;
    const titre = this.deleteTarget.titre;
    const id = this.deleteTarget.id;
    this.deleteTarget = null;
    this.tableauService.delete(id).subscribe({
      next: () => {
        this.toastService.success(`« ${titre} » supprimé`);
        this.load();
      },
      error: () => this.toastService.error('Erreur lors de la suppression')
    });
  }

  cancelDelete(): void {
    this.deleteTarget = null;
  }
}
