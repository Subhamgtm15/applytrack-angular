import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class AppComponent {
  // exact:true only for the home link ('/' is a prefix of every route).
  navItems = [
    { path: '/', label: 'Dashboard', exact: true },
    { path: '/applications', label: 'Applications', exact: false },
    { path: '/addapplication', label: 'Add Application', exact: false },
    { path: '/settings', label: 'Settings', exact: false },
  ];
}
