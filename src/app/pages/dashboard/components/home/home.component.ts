import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../../shared/services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  currentLang!: string;

  constructor(private translate: TranslateService, private themeService: ThemeService) {
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.translate.use(this.currentLang);
    document.documentElement.lang = this.currentLang;
  }

  toggleTheme() {
    this.themeService.setTheme(this.themeService.currentTheme === 'theme1' ? 'theme2' : 'theme1');
  }
}
