import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableauService, TypeDto, TableauResponse } from '../tableau.service';

@Component({
  selector: 'app-tableau-form',
  templateUrl: './tableau-form.component.html'
})
export class TableauFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  editId: number | null = null;
  types: TypeDto[] = [];
  imagePreview: string | null = null;
  existingImageUrl: string | null = null;
  selectedFile: File | null = null;
  loading = false;
  error = '';

  readonly imageBase = this.tableauService.imageBase;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tableauService: TableauService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      largeur: [null, [Validators.required, Validators.min(1)]],
      hauteur: [null, [Validators.required, Validators.min(1)]],
      typeId: [null],
      periode: ['', Validators.required],
      prix: [null],
      description: [null],
      statut: ['disponible', Validators.required],
      visible: [true],
      ordre: [0]
    });

    this.tableauService.getTypes().subscribe({
      next: (types) => (this.types = types)
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.editId = +idParam;
      this.tableauService.getById(this.editId).subscribe({
        next: (t: TableauResponse) => {
          this.existingImageUrl = t.imageUrl;
          this.form.patchValue({
            titre: t.titre,
            largeur: t.largeur,
            hauteur: t.hauteur,
            typeId: t.type?.id ?? null,
            periode: t.periode,
            prix: t.prix,
            description: t.description,
            statut: t.statut,
            visible: t.visible,
            ordre: t.ordre
          });
        },
        error: () => {
          this.error = 'Impossible de charger le tableau.';
        }
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    if (!this.isEdit && !this.selectedFile) {
      this.error = 'Veuillez sélectionner une image.';
      return;
    }

    this.loading = true;
    this.error = '';
    const data = this.form.value;

    if (this.isEdit && this.editId !== null) {
      this.tableauService.update(this.editId, data, this.selectedFile ?? undefined).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: () => {
          this.loading = false;
          this.error = "Une erreur est survenue lors de la mise à jour.";
        }
      });
    } else {
      this.tableauService.create(this.selectedFile!, data).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: () => {
          this.loading = false;
          this.error = "Une erreur est survenue lors de la création.";
        }
      });
    }
  }
}
