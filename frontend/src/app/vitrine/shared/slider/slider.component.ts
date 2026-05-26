import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VitrineTableau } from '../../services/vitrine-tableau.service';
import { AdminModeService } from '../../services/admin-mode.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnChanges {
  @Input() tableaux: VitrineTableau[] = [];

  prevIndex = 0;
  currentIndex = 0;
  nextIndex = 0;

  constructor(
    public adminMode: AdminModeService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableaux'] && this.tableaux.length > 0) {
      this.prevIndex = this.tableaux.length - 1;
      this.currentIndex = 0;
      this.nextIndex = Math.min(1, this.tableaux.length - 1);
    }
  }

  spinLeft(): void {
    if (this.tableaux.length < 2) return;
    this.prevIndex = this.mod(this.prevIndex - 1);
    this.currentIndex = this.mod(this.currentIndex - 1);
    this.nextIndex = this.mod(this.nextIndex - 1);
  }

  spinRight(): void {
    if (this.tableaux.length < 2) return;
    this.prevIndex = this.mod(this.prevIndex + 1);
    this.currentIndex = this.mod(this.currentIndex + 1);
    this.nextIndex = this.mod(this.nextIndex + 1);
  }

  editTableau(id: number): void {
    this.router.navigate(['/admin/tableaux', id, 'edit']);
  }

  private mod(n: number): number {
    return ((n % this.tableaux.length) + this.tableaux.length) % this.tableaux.length;
  }

  get prev(): VitrineTableau | null {
    return this.tableaux[this.prevIndex] ?? null;
  }

  get current(): VitrineTableau | null {
    return this.tableaux[this.currentIndex] ?? null;
  }

  get next(): VitrineTableau | null {
    return this.tableaux[this.nextIndex] ?? null;
  }
}
