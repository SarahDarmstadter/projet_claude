import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArtisteComponent } from './artiste/artiste.component';
import { OeuvresComponent } from './oeuvres/oeuvres.component';
import { OeuvreDetailComponent } from './oeuvres/oeuvre-detail/oeuvre-detail.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'artiste', component: ArtisteComponent },
  { path: 'oeuvres', component: OeuvresComponent },
  { path: 'oeuvres/:id', component: OeuvreDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VitrineRoutingModule {}
