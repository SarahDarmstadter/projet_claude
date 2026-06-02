import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'tableaux', pathMatch: 'full' },
      {
        path: 'tableaux',
        loadChildren: () => import('./tableau/tableau.module').then(m => m.TableauModule)
      },
      {
        path: 'textes',
        loadChildren: () => import('./textes/textes.module').then(m => m.TextesModule)
      }
    ])
  ]
})
export class AdminModule {}
