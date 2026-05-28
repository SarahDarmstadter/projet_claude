import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { VitrineRoutingModule } from './vitrine-routing.module';

import { HomeComponent } from './home/home.component';
import { ArtisteComponent } from './artiste/artiste.component';
import { OeuvresComponent } from './oeuvres/oeuvres.component';
import { OeuvreDetailComponent } from './oeuvres/oeuvre-detail/oeuvre-detail.component';
import { ContactComponent } from './contact/contact.component';
import { HeadingComponent } from './shared/heading/heading.component';
import { SliderComponent } from './shared/slider/slider.component';
import { SliderMobileComponent } from './shared/slider-mobile/slider-mobile.component';
import { PageBottomComponent } from './shared/page-bottom/page-bottom.component';
import { AdminFabComponent } from './shared/admin-fab/admin-fab.component';
import { TableauEditModalComponent } from './shared/tableau-edit-modal/tableau-edit-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    ArtisteComponent,
    OeuvresComponent,
    OeuvreDetailComponent,
    ContactComponent,
    HeadingComponent,
    SliderComponent,
    SliderMobileComponent,
    PageBottomComponent,
    AdminFabComponent,
    TableauEditModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    VitrineRoutingModule,
  ]
})
export class VitrineModule {}
