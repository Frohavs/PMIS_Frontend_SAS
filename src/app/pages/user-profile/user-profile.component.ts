import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { PageInfoService } from 'src/app/_metronic/layout';
import { AuthService } from 'src/app/modules/auth';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { NewUserService } from 'src/app/services/new-user.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit, OnDestroy {

  userId: number;
  profileForm: FormGroup;

  selectedCV: File;
  selectedImg: File;
  imageSrc: any;

  isLoading: boolean;
  // modal configs
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private _location: Location,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private newUserService: NewUserService,
    private pageInfoService: PageInfoService,
    private attachmentService: AttachmentService,
  ) {
    this.pageInfoService.setTitle('asdsa')
  }

  ngOnInit(): void {
    this.initProfileForm();

    this.authService.currentUser$.subscribe((res: any) => {
      this.userId = +res.id;
      this.newUserService.getUser(res.id).subscribe(res => {
        debugger
        this.profileForm.patchValue({
          fullName: res?.data.fullName,
          email: res?.data?.email,
          phone: res?.data?.phoneNumber || ''
        })
      })
    });
  }

  initProfileForm() {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      attachment: ['', Validators.required],
      profilePic: ['', Validators.required],

    });
  }

  onCVSelected(event: Event) {
    let fileName = '';
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedCV = input.files[0];
      fileName = input.files[0].name;
    }
    const fd = new FormData();
    fd.append('Attachment', this.selectedCV, this.selectedCV.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.profileForm.patchValue({
        attachment: fileName
      });
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  onImgSelected(event: Event) {
    let fileName = '';
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImg = input.files[0];
      fileName = input.files[0].name;
      // for show and hide img only
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string; // Set the image source for preview
        this.cdr.detectChanges(); // Trigger change detection to update the view
      };
      reader.readAsDataURL(input?.files[0]);
    }

    const fd = new FormData();
    fd.append('Attachment', this.selectedImg, this.selectedImg.name);
    this.attachmentService.uploadAttachment(fd).subscribe(res => {
      this.profileForm.patchValue({
        profilePic: fileName
      });
    }, () => {
      this.imageSrc = null;
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  saveData() {
    const payload =
      { ...this.profileForm.value, id: this.userId }
    this.newUserService.UpdateUserProfile(payload).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 'Data Updated successfully!' });
    },() => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
    });
  }

  back() {
    this._location.back();
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
