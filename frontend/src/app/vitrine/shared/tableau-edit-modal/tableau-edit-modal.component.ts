import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableauService, TypeDto } from '../../../admin/tableau/tableau.service';

@Component({
  selector: 'app-tableau-edit-modal',
  templateUrl: './tableau-edit-modal.component.html',
  styleUrls: ['./tableau-edit-modal.component.css']
})
export class TableauEditModalComponent implements OnChanges {
  @Input() tableauId: number | null = null;
  @Output() closed = new EventEmitter<boolean>();

  form!: FormGroup;
  types: TypeDto[] = [];
  imagePreview: string | null = null;
  existingImageUrl: string | null = null;
  selectedFile: File | null = null;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private tableauService: TableauService
  ) {
    this.form = this.fb.group({
      titre:       ['', Validators.required],
      largeur:     [null, [Validators.required, Validators.min(1)]],
      hauteur:     [null, [Validators.required, Validators.min(1)]],
      typeId:      [null, Validators.required],
      periode:     ['', Validators.required],
      prix:        ['', Validators.pattern(/^[0-9]+([.,][0-9]{1,2})?$/)],
      description: [null],
      statut:      ['disponible', Validators.required],
      visible:     [true],
      ordre:       [0]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableauId'] && this.tableauId !== null) {
      this.load();
    }
  }

  private load(): void {
    this.error = '';
    this.imagePreview = null;
    this.selectedFile = null;
    this.tableauService.getTypes().subscribe({ next: t => (this.types = t) });
    this.tableauService.getById(this.tableauId!).subscribe({
      next: t => {
        this.existingImageUrl = t.imageUrl;
        this.form.patchValue({
          titre:       t.titre,
          largeur:     t.largeur,
          hauteur:     t.hauteur,
          typeId:      t.type?.id ?? null,
          periode:     t.periode,
          prix:        t.prix != null ? String(t.prix) : '',
          description: t.description,
          statut:      t.statut,
          visible:     t.visible,
          ordre:       t.ordre
        });
      },
      error: () => { this.error = 'Impossible de charger le tableau.'; }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => { this.imagePreview = reader.result as string; };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit(): void {
    if (this.form.invalid || this.tableauId === null) return;
    this.loading = true;
    this.error = '';
    const raw = this.form.value;
    const prixStr: string = raw.prix?.trim() ?? '';
    const data = { ...raw, prix: prixStr ? parseFloat(prixStr.replace(',', '.')) : null };

    this.tableauService.update(this.tableauId, data, this.selectedFile ?? undefined).subscribe({
      next: ()  => { this.loading = false; this.closed.emit(true); },
      error: () => { this.loading = false; this.error = 'Une erreur est survenue.'; }
    });
  }

  cancel(): void {
    this.closed.emit(false);
  }
}
