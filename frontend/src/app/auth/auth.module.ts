import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { TwoFactorComponent } from './components/two-factor/two-factor.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
@NgModule({
  declarations: [
    LoginComponent,
    TwoFactorComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'login',           component: LoginComponent },
      { path: 'verify-2fa',      component: TwoFactorComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password',  component: ResetPasswordComponent }
    ])
  ],
  providers: []
})
export class AuthModule {}
