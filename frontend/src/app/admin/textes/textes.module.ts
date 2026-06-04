import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextesComponent } from './textes.component';
import { AdminToastComponent } from '../shared/toast.component';

@NgModule({
  declarations: [TextesComponent],
  imports: [
    CommonModule,
    FormsModule,
    AdminToastComponent,
    RouterModule.forChild([
      { path: '', component: TextesComponent }
    ])
  ]
})
export class TextesModule {}
