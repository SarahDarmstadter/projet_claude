import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { VitrineTableau, VitrineTableauService } from '../services/vitrine-tableau.service';
import { TexteService } from '../services/texte.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tableaux: VitrineTableau[] = [];
  loading = true;

  constructor(
    private vitrineService: VitrineTableauService,
    public textes: TexteService,
    private titleService: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Pierre Darmstadter — Peintures');
    this.meta.updateTag({ name: 'description', content: 'Peintre contemporain parisien, Pierre Darmstadter explore la lumière et la matière dans ses toiles.' });
    this.meta.updateTag({ property: 'og:title', content: 'Pierre Darmstadter — Peintures' });
    this.meta.updateTag({ property: 'og:description', content: 'Peintre contemporain parisien, Pierre Darmstadter explore la lumière et la matière dans ses toiles.' });

    this.vitrineService.getVisible().subscribe({
      next: (data) => { this.tableaux = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get latestTableaux(): VitrineTableau[] {
    return [...this.tableaux].sort((a, b) => b.id - a.id).slice(0, 3);
  }
}
