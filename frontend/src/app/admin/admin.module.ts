import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AdminDashboardComponent },
      {
        path: 'tableaux',
        loadChildren: () => import('./tableau/tableau.module').then(m => m.TableauModule)
      }
    ])
  ]
})
export class AdminModule {}
