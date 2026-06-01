import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TableauListComponent } from './tableau-list/tableau-list.component';
import { TableauFormComponent } from './tableau-form/tableau-form.component';
import { TypeListComponent } from './type-list/type-list.component';
import { AdminToastComponent } from '../shared/toast.component';

@NgModule({
  declarations: [
    TableauListComponent,
    TableauFormComponent,
    TypeListComponent,
    AdminToastComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    RouterModule.forChild([
      { path: '', component: TableauListComponent },
      { path: 'nouveau', component: TableauFormComponent },
      { path: 'types', component: TypeListComponent },
      { path: ':id/edit', component: TableauFormComponent }
    ])
  ]
})
export class TableauModule {}
