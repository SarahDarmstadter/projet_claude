import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VitrineTableau } from '../../services/vitrine-tableau.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnChanges {
  @Input() tableaux: VitrineTableau[] = [];
  @ViewChild('carouselTrack') trackRef!: ElementRef<HTMLElement>;

  activeIndex = 0;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableaux']) {
      this.activeIndex = 0;
    }
  }

  onScroll(): void {
    const track = this.trackRef?.nativeElement;
    if (!track || this.tableaux.length === 0) return;
    const itemW = track.scrollWidth / this.tableaux.length;
    this.activeIndex = Math.round(track.scrollLeft / itemW);
  }

  scrollTo(i: number): void {
    const track = this.trackRef?.nativeElement;
    if (!track) return;
    const itemW = track.scrollWidth / this.tableaux.length;
    track.scrollTo({ left: itemW * i, behavior: 'smooth' });
    this.activeIndex = i;
  }

  navigate(id: number): void {
    this.router.navigate(['/oeuvres', id]);
  }
}
