import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { TramitesComponent } from './tramites.component';
import { ManageTramitesComponent } from './manage-tramites.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'tramites', component: TramitesComponent, canActivate: [AuthGuard] },
  { path: 'manage-tramites', component: ManageTramitesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
