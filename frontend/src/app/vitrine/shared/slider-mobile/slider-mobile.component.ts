import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { VitrineTableau } from '../../services/vitrine-tableau.service';
import { AdminModeService } from '../../services/admin-mode.service';

@Component({
  selector: 'app-slider-mobile',
  templateUrl: './slider-mobile.component.html',
  styleUrls: ['./slider-mobile.component.css']
})
export class SliderMobileComponent implements OnChanges {
  @Input() tableaux: VitrineTableau[] = [];
  @Output() editRequested = new EventEmitter<number>();

  index = 0;
  private touchStartX = 0;

  constructor(public adminMode: AdminModeService) {}

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

  editTableau(id: number): void {
    this.editRequested.emit(id);
  }
}
