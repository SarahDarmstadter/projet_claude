import { Component } from '@angular/core';
import { TexteService } from '../services/texte.service';

@Component({
  selector: 'app-artiste',
  templateUrl: './artiste.component.html',
  styleUrls: ['./artiste.component.css']
})
export class ArtisteComponent {
  constructor(public textes: TexteService) {}
}
