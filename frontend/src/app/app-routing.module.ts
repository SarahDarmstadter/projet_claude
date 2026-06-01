import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: 'login',            redirectTo: 'auth/login',            pathMatch: 'full' },
  { path: 'verify-2fa',       redirectTo: 'auth/verify-2fa',       pathMatch: 'full' },
  { path: 'forgot-password',  redirectTo: 'auth/forgot-password',  pathMatch: 'full' },
  { path: 'reset-password',   redirectTo: 'auth/reset-password',   pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./vitrine/vitrine.module').then(m => m.VitrineModule)
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
