import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme: string = 'theme1';

  constructor() {
    
  }

  setTheme(theme: string) {
    this.currentTheme = theme;
    this.applyTheme();
  }

  private applyTheme() {
    document.body.classList.remove('theme1', 'theme2');
    document.body.classList.add(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme)
  }
}
