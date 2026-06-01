import { Component } from '@angular/core';
import { TexteService } from '../../services/texte.service';

@Component({
  selector: 'app-page-bottom',
  templateUrl: './page-bottom.component.html',
  styleUrls: ['./page-bottom.component.css']
})
export class PageBottomComponent {
  year = new Date().getFullYear();
  constructor(public textes: TexteService) {}
}
