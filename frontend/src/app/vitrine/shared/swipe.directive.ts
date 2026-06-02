import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({ selector: '[appSwipe]' })
export class SwipeDirective {
  @Output() swipeLeft  = new EventEmitter<void>();
  @Output() swipeRight = new EventEmitter<void>();

  private startX = 0;
  private startY = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent): void {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.startX;
    const dy = e.changedTouches[0].clientY - this.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) this.swipeLeft.emit();
      else        this.swipeRight.emit();
    }
  }
}
