import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArtisteComponent } from './artiste/artiste.component';
import { OeuvresComponent } from './oeuvres/oeuvres.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'artiste', component: ArtisteComponent },
  { path: 'oeuvres', component: OeuvresComponent },
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VitrineRoutingModule {}
