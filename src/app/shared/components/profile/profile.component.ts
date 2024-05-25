import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  currentLang: string;
  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router
  ) {
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.translate.use(this.currentLang);
    document.documentElement.lang = this.currentLang;
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['test', [Validators.required]],
      email: ['test@test.com', [Validators.required, Validators.email]],
      remember: [false],
    });
  }

  onSubmit() {
    // localStorage.setItem('user', this.username?.value);
    // this.router.navigate(['./dashboard']);
  }

  get name() {
    return this.profileForm.get('name');
  }

  get email() {
    return this.profileForm.get('email');
  }

  changeCurrentLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('currentLang', lang);
    window.location.reload();
  }

}
