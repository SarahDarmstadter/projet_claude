import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { VitrineTableau } from '../../services/vitrine-tableau.service';

@Component({
  selector: 'app-slider-mobile',
  templateUrl: './slider-mobile.component.html',
  styleUrls: ['./slider-mobile.component.css']
})
export class SliderMobileComponent {
  @Input() tableaux: VitrineTableau[] = [];
  @ViewChild('track') trackRef!: ElementRef<HTMLElement>;

  currentIndex = 0;
  private touchStartX = 0;

  constructor(private router: Router) {}

  get visibleTableaux(): VitrineTableau[] {
    return this.tableaux.slice(0, 5);
  }

  get slideIndices(): number[] {
    return Array.from({ length: this.visibleTableaux.length + 1 });
  }

  get currentTableau(): VitrineTableau | null {
    return this.visibleTableaux[this.currentIndex] ?? null;
  }

  onScroll(): void {
    const el = this.trackRef?.nativeElement;
    if (!el || !el.clientWidth) return;
    this.currentIndex = Math.round(el.scrollLeft / el.clientWidth);
  }

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0]?.clientX ?? 0;
  }

  onTouchEnd(e: TouchEvent, id: number): void {
    if (!e.changedTouches.length) return;
    const dx = Math.abs(e.changedTouches[0].clientX - this.touchStartX);
    if (dx < 10) {
      this.router.navigate(['/oeuvres', id]);
    }
  }
}
