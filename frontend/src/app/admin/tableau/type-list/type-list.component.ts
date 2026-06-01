import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TableauService, TypeDto } from '../tableau.service';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html'
})
export class TypeListComponent implements OnInit {
  types: TypeDto[] = [];
  editingId: number | null = null;
  newNom = '';
  editNom = '';
  error = '';

  constructor(
    private tableauService: TableauService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.tableauService.getTypes().subscribe({
      next: (types) => (this.types = types),
      error: () => (this.error = 'Impossible de charger les types.')
    });
  }

  createType(): void {
    const nom = this.newNom.trim();
    if (!nom) return;
    this.error = '';
    this.tableauService.createType(nom).subscribe({
      next: () => {
        this.newNom = '';
        this.toastService.success(`Type « ${nom} » créé`);
        this.load();
      },
      error: () => {
        this.error = 'Erreur lors de la création du type.';
        this.toastService.error('Erreur lors de la création du type');
      }
    });
  }

  startEdit(t: TypeDto): void {
    this.editingId = t.id;
    this.editNom = t.nom;
    this.error = '';
  }

  saveEdit(t: TypeDto): void {
    const nom = this.editNom.trim();
    if (!nom) return;
    this.error = '';
    this.tableauService.updateType(t.id, nom).subscribe({
      next: () => {
        this.editingId = null;
        this.toastService.success(`Type renommé en « ${nom} »`);
        this.load();
      },
      error: () => {
        this.error = 'Erreur lors de la mise à jour du type.';
        this.toastService.error('Erreur lors de la mise à jour du type');
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editNom = '';
    this.error = '';
  }

  deleteType(t: TypeDto): void {
    this.error = '';
    this.tableauService.deleteType(t.id).subscribe({
      next: () => {
        this.toastService.success(`Type « ${t.nom} » supprimé`);
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.error = `Le type « ${t.nom} » est utilisé par un ou plusieurs tableaux et ne peut pas être supprimé.`;
        } else {
          this.error = 'Erreur lors de la suppression du type.';
          this.toastService.error('Erreur lors de la suppression du type');
        }
      }
    });
  }
}
