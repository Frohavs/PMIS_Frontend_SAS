import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  currentLang: string;
  forgetPassForm!: FormGroup;

  ShowPass: boolean = false;
  passType: string = 'password';
  passwordVisibilityIcon: string = 'bi bi-eye-slash';

  constructor(private fb: FormBuilder, private translate: TranslateService, private router: Router) {
    this.currentLang = localStorage.getItem('currentLang') || 'en';
    this.translate.use(this.currentLang);
    document.documentElement.lang = this.currentLang;
  }

  ngOnInit(): void {
    this.forgetPassForm = this.fb.group({
      username: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.passType = this.passType === 'password' ? 'text' : 'password';
    this.passwordVisibilityIcon = this.passType === 'password' ? 'bi bi-eye-slash' : 'bi bi-eye';
  }

  onSubmit() {
    // this.router.navigate(['./dashboard'])
  }
  
  get username() {
    return this.forgetPassForm.get('username');
  }
  
  
  changeCurrentLang(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('currentLang', lang);
    window.location.reload();
  }
  
  navigateLogin() {
    this.router.navigate(['./login'])
  }
}
