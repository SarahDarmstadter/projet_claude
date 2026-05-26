import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <app-heading></app-heading>
    <main class="page-content">
      <h2>Contact</h2>
      <p>Pierre Darmstadter</p>
      <p><a href="mailto:pierre.darmstadter@gmail.com">pierre.darmstadter&#64;gmail.com</a></p>
    </main>
    <app-page-bottom></app-page-bottom>
  `,
  styles: ['.page-content { padding: 5% 10%; font-family: "OldStandardTT-Regular", serif; } a { color: black; }']
})
export class ContactComponent {}
