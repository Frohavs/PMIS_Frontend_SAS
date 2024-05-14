import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  currentLang!: string;

  constructor(private translate: TranslateService) {
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.translate.use(this.currentLang);
    document.documentElement.lang = this.currentLang;
  }

}
