import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { VitrineTableau } from '../../services/vitrine-tableau.service';

@Component({
  selector: 'app-slider-mobile',
  templateUrl: './slider-mobile.component.html',
  styleUrls: ['./slider-mobile.component.css']
})
export class SliderMobileComponent implements OnChanges, OnDestroy {
  @Input() tableaux: VitrineTableau[] = [];

  index = 0;
  slideDirection: 'left' | 'right' | null = null;
  private touchStartX = 0;
  private dirTimer: any;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableaux']) this.index = 0;
  }

  ngOnDestroy(): void {
    clearTimeout(this.dirTimer);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const delta = event.changedTouches[0].clientX - this.touchStartX;
    if (delta < -50) this.swipeLeft();
    else if (delta > 50) this.swipeRight();
  }

  swipeLeft(): void {
    this.setDirection('left');
    this.index = (this.index + 1) % this.tableaux.length;
  }

  swipeRight(): void {
    this.setDirection('right');
    this.index = (this.index - 1 + this.tableaux.length) % this.tableaux.length;
  }

  goTo(i: number): void {
    if (i === this.index) return;
    // Détermine la direction en tenant compte du wrap circulaire
    const total = this.tableaux.length;
    const forward = i > this.index;
    const isWrap = Math.abs(i - this.index) > total / 2;
    this.setDirection(forward !== isWrap ? 'left' : 'right');
    this.index = i;
  }

  private setDirection(dir: 'left' | 'right'): void {
    clearTimeout(this.dirTimer);
    this.slideDirection = dir;
    this.dirTimer = setTimeout(() => { this.slideDirection = null; }, 500);
  }

  navigate(id: number): void {
    this.router.navigate(['/oeuvres', id]);
  }
}
