import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
//import { RegisterComponent } from './register.component';
import { TramitesComponent } from './tramites.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home.component';
import { ManageTramitesComponent } from './manage-tramites.component';
import { ManageUsuariosComponent } from './manage-usuarios.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'login', component: LoginComponent },
	//{ path: 'register', component: RegisterComponent },
	{ path: 'tramites', component: TramitesComponent, canActivate: [AuthGuard] },
	{ path: 'manage-tramites', component: ManageTramitesComponent, canActivate: [AuthGuard] },
	{ path: 'manage-usuarios', component: ManageUsuariosComponent, canActivate: [AuthGuard] },
];
