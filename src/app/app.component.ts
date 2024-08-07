import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import { locale as arLang } from './modules/i18n/vocabs/ar';
import { locale as enLang } from './modules/i18n/vocabs/en';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      arLang,
      // chLang,
      // esLang,
      // jpLang,
      // deLang,
      // frLang
    );
    this.translationService.setHtmlLang(localStorage.getItem('language'));
  }

  ngOnInit() {
    this.modeService.init();
  }
}
