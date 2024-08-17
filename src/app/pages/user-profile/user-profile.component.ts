import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageInfoService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit, OnDestroy {

  userId: number;

  isLoading: boolean;
  profileForm: FormGroup;
  private unsubscribe: Subscription[] = [];



  constructor(
    private router: Router,
    private _location: Location,
    private pageInfoService: PageInfoService,
    private fb: FormBuilder,
  ) {
    this.pageInfoService.setTitle('asdsa')
  }

  ngOnInit(): void {
    this.initProfileForm();

  }

  initProfileForm() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      updatedCV: [null, Validators.required],
      updatedImg: ['', Validators.required],

    });
  }




  back() {
    this._location.back();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
