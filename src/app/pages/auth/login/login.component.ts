import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  currentLang: string;
  loginForm!: FormGroup;

  ShowPass: boolean = false;
  passType: string = 'password';
  passwordVisibilityIcon: string = 'bi bi-eye-slash';

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
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false],
    });
  }

  togglePasswordVisibility() {
    this.passType = this.passType === 'password' ? 'text' : 'password';
    this.passwordVisibilityIcon =
      this.passType === 'password' ? 'bi bi-eye-slash' : 'bi bi-eye';
  }

  onSubmit() {
    localStorage.setItem('user', this.username?.value);
    this.router.navigate(['./dashboard']);
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  changeCurrentLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('currentLang', lang);
    window.location.reload();
  }

  navigateForgetPass() {
    this.router.navigate(['./login/forget-password']);
  }
}
