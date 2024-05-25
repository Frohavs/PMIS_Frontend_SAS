import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Languages, userItems } from './header-data';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  currentLang!: string;
  userDetails: any;
  userItems = userItems;

  selectedLanguage: any;
  languages = Languages;

  canShowOverlayAsSearch!: boolean;

  constructor(private router: Router, private translate: TranslateService) {}

  @HostListener('window:resize', ['$event'])
  onResize(eventL: any) {
    this.checkCanShowOverlayAsSearch(window.innerWidth);
  }

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.checkCanShowOverlayAsSearch(window.innerWidth);
    this.selectedLanguage = (localStorage.getItem('currentLang') === 'en') ? this.languages[0] : this.languages[1];
    this.userDetails = JSON.parse(localStorage.getItem('user') || '');
  }

  checkCanShowOverlayAsSearch(innerWidth: number) {
    this.canShowOverlayAsSearch = innerWidth < 845 ? true : false;
  }

  changeLang(lang: string) {
    if (localStorage.getItem('currentLang') === lang) return;
    this.translate.use(lang);
    localStorage.setItem('currentLang', lang);
    window.location.reload();
  }

  action(label: string) {
    switch (label) {
      case 'logout':
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
        break;
      case 'profile':
        this.router.navigateByUrl('/dashboard/profile');
        break;

      default:
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.router.navigateByUrl('/login');
        break;
    }
  }
}
