import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pmis_frontend';

  constructor() {
    // aading initial theme
    document.body.classList.add(localStorage.getItem('theme') || 'theme1');
  }
}
