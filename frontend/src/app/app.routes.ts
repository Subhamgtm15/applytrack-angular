import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ApplicationsComponent } from './pages/applications/applications';
import { AddApplicationComponent } from './pages/add-application/add-application';
import { SettingsComponent } from './pages/settings/settings';
import { LoginComponent } from './pages/auth/login';
import { SignupComponent } from './pages/auth/signup';
import { MainLayoutComponent } from './layout/main-layout';
import { authGuard } from './guards/auth.guard';

// The route table: public auth pages sit outside the shell; the app pages are
// children of MainLayout (so they get the sidebar) and are protected by authGuard.
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'addapplication', component: AddApplicationComponent },
      { path: 'addapplication/:id', component: AddApplicationComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];
