import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TexteService } from '../services/texte.service';

@Component({
  selector: 'app-artiste',
  templateUrl: './artiste.component.html',
  styleUrls: ['./artiste.component.css']
})
export class ArtisteComponent implements OnInit, OnDestroy {

  private static readonly DEFAULT_EXPOSITIONS = [
    { annee: '2023', lieu: 'Galerie Les Yeux Fertiles, Paris', titre: 'Lumières intérieures — peintures récentes' },
    { annee: '2021', lieu: 'Espace Bateau-Lavoir, Montmartre', titre: 'Matières et transparences' },
    { annee: '2019', lieu: 'Galerie du Marais, Paris', titre: 'Figures et présences' },
    { annee: '2017', lieu: "Centre d'art contemporain, Lyon", titre: "L'eau, la lumière, le temps" },
  ];

  expositions: Array<{ annee: string; lieu: string; titre: string }> = [];
  private textesSub?: Subscription;

  constructor(public textes: TexteService, private titleService: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Biographie — Pierre Darmstadter');
    this.meta.updateTag({ name: 'description', content: "Biographie de Pierre Darmstadter, peintre contemporain parisien — parcours, expositions et collections." });
    this.meta.updateTag({ property: 'og:title', content: 'Biographie — Pierre Darmstadter' });
    this.meta.updateTag({ property: 'og:description', content: "Biographie de Pierre Darmstadter, peintre contemporain parisien — parcours, expositions et collections." });
    this.expositions = this.buildExpositions();
    this.textesSub = this.textes.textes$.subscribe(() => { this.expositions = this.buildExpositions(); });
  }

  ngOnDestroy(): void {
    this.textesSub?.unsubscribe();
  }

  private buildExpositions(): Array<{ annee: string; lieu: string; titre: string }> {
    const list: Array<{ annee: string; lieu: string; titre: string }> = [];
    for (let i = 1; i <= 8; i++) {
      const annee = this.textes.get(`artiste.expo.${i}.annee`);
      if (!annee) break;
      list.push({ annee, lieu: this.textes.get(`artiste.expo.${i}.lieu`), titre: this.textes.get(`artiste.expo.${i}.titre`) });
    }
    return list.length > 0 ? list : ArtisteComponent.DEFAULT_EXPOSITIONS;
  }
}
