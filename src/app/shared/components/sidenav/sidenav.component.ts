import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  currentLang!: string;
  collpased = false;
  screenWidth = 0;

  @HostListener('window:resize', ['$event'])
  onResize(eventL: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collpased = true;
    } else {
      this.collpased = false;
    }
  }

  constructor(private translate: TranslateService, private router: Router) {
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.translate.use(this.currentLang);
    document.documentElement.lang = this.currentLang;
  }

  toggleSidenav() {
    document.querySelector('#sidebar')?.classList.toggle('expand');
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
