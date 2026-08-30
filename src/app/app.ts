import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class AppComponent {

  // Logic / data
  name = 'Alex';
  applications = 5;

  // Logic / function
  increaseApplications() {
    this.applications++;
  }
}
