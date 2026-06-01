import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { VitrineTableau } from '../../services/vitrine-tableau.service';

@Component({
  selector: 'app-slider-mobile',
  templateUrl: './slider-mobile.component.html',
  styleUrls: ['./slider-mobile.component.css']
})
export class SliderMobileComponent implements OnChanges {
  @Input() tableaux: VitrineTableau[] = [];

  index = 0;
  private touchStartX = 0;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableaux']) {
      this.index = 0;
    }
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
    this.index = (this.index + 1) % this.tableaux.length;
  }

  swipeRight(): void {
    this.index = (this.index - 1 + this.tableaux.length) % this.tableaux.length;
  }

  navigate(id: number): void {
    this.router.navigate(['/oeuvres', id]);
  }
}
