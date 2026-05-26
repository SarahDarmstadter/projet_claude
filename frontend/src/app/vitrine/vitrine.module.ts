import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { VitrineRoutingModule } from './vitrine-routing.module';

import { HomeComponent } from './home/home.component';
import { ArtisteComponent } from './artiste/artiste.component';
import { OeuvresComponent } from './oeuvres/oeuvres.component';
import { ContactComponent } from './contact/contact.component';
import { HeadingComponent } from './shared/heading/heading.component';
import { SliderComponent } from './shared/slider/slider.component';
import { SliderMobileComponent } from './shared/slider-mobile/slider-mobile.component';
import { PageBottomComponent } from './shared/page-bottom/page-bottom.component';
import { AdminFabComponent } from './shared/admin-fab/admin-fab.component';

@NgModule({
  declarations: [
    HomeComponent,
    ArtisteComponent,
    OeuvresComponent,
    ContactComponent,
    HeadingComponent,
    SliderComponent,
    SliderMobileComponent,
    PageBottomComponent,
    AdminFabComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    VitrineRoutingModule,
  ]
})
export class VitrineModule {}
