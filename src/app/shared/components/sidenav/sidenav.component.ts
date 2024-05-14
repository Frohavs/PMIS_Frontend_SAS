import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  constructor() {

  }

  toggleSidenav() {
    document.querySelector('#sidebar')?.classList.toggle('expand')
  }
}
