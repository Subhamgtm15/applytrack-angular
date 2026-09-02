import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ApplicationsComponent } from './pages/applications/applications';
import { AddApplicationComponent } from './pages/add-application/add-application';
import { SettingsComponent } from './pages/settings/settings';

// The route table: each entry maps a URL path to a component.
export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: 'addapplication', component: AddApplicationComponent },
  { path: 'addapplication/:id', component: AddApplicationComponent },
  { path: 'settings', component: SettingsComponent },
];
