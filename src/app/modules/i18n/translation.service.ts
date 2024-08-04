// Localization is based on '@ngx-translate/core';
// Please be familiar with official documentations first => https://github.com/ngx-translate/core

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Locale {
  lang: string;
  data: any;
}

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  // Private properties
  private langIds: any = [];

  constructor(private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: Object) {
    // add new langIds to the list
    this.translate.addLangs(['en']);

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);
      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
    this.translate.use(this.getSelectedLanguage());
  }

  setLanguage(lang: string) {
    if (lang) {
      this.translate.use(this.translate.getDefaultLang());
      this.translate.use(lang);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);

      location.reload();
    }
  }

  setHtmlLang(lang: any) {
    const htmlElement = document.getElementsByTagName('html')[0];
    htmlElement.setAttribute('lang', lang);


    // Remove existing stylesheet link
    const existingStyleLink = document.querySelector('link[href="styles.css"]');
    const existingStyleLink2 = document.querySelector('link[href="./assets/css/style.rtl.css"]');
    if (existingStyleLink) existingStyleLink.remove();
    if (existingStyleLink2) existingStyleLink2.remove();

    // check arabic lang selection
    htmlElement.setAttribute('direction', lang === 'ar' ? 'rtl' : 'ltr');
    htmlElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    htmlElement.setAttribute('style',lang === 'ar' ? 'direction: rtl' : 'direction: ltr')
    if(isPlatformBrowser(this.platformId)) document.documentElement.lang = lang;


    // Add new stylesheet link based on language
    const newStyleLink = document.createElement('link');
    newStyleLink.rel = 'stylesheet';
    newStyleLink.href = lang === 'ar' ? './assets/css/style.rtl.css' : 'styles.css';
    document.head.appendChild(newStyleLink);
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    );
  }
}
