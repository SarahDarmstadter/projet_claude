import { Component } from '@angular/core';

@Component({
  selector: 'app-artiste',
  template: `
    <app-heading></app-heading>
    <main class="page-content">
      <h2>L'artiste</h2>
      <p>Biographie de Pierre Darmstadter à venir.</p>
    </main>
    <app-page-bottom></app-page-bottom>
  `,
  styles: ['.page-content { padding: 5% 10%; font-family: "OldStandardTT-Regular", serif; }']
})
export class ArtisteComponent {}
