import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class AppComponent {
  // exact:true for the home link so it isn't marked active on every route.
  navItems = [
    { path: '/', label: 'Dashboard', exact: true },
    { path: '/applications', label: 'Applications', exact: false },
  ];
}
