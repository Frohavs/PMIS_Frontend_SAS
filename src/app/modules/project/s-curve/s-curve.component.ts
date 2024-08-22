import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SCurveService } from 'src/app/services/s-curve.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-s-curve',
  templateUrl: './s-curve.component.html',
  styleUrl: './s-curve.component.scss'
})
export class SCurveComponent implements OnInit {
  projectId: number;

  Add_text: string;
  Search_text: string;
  dataList: any[] = [];
  sCurveTemplate: string;
  selectedFile: File | null;

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;

  userModel: { id: number | null, name: string, role: number } = { id: null, name: '', role: 0 };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  @ViewChild('fileInput') fileInput: ElementRef;


  constructor(
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private sCurveService: SCurveService,
    private translate: TranslateService,
  ) {
    this.Add_text = this.translate.instant('BOQ.Add_Boq');
    this.Search_text = this.translate.instant('BOQ.Search');
  }

  ngOnInit(): void {
    this.getBoqId();
    this.sCurveService.downloadScurve(this.projectId).subscribe(res => {
      debugger
      this.sCurveTemplate = res.data;
    })
  }

  initializeProjectData(id: number) {
    this.sCurveService.getAll(id).subscribe(res => {
      this.dataList = [];
      this.cdr.detectChanges();
    });
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.initializeProjectData(this.projectId)
      }
    });
  }

  approveSCurve() {
    // this.router.navigateByUrl('projects/add-boq' + `/${this.projectId}`)
  }

  downloadTemplate() {
    if(!this.sCurveTemplate) {
      alert('file not returned')
      return;
    }
    window.open(this.sCurveTemplate);
  }

  uploadTemplate(event: Event) {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadSCurve() {
    if (this.selectedFile) {
      const fd = new FormData();
      fd.append('file', this.selectedFile, this.selectedFile.name);
      this.sCurveService.uploadSCurveFile(this.projectId, fd).subscribe(res => {
        this.showAlert({ icon: 'success', title: 'Success!', text: 'file Uploaded successfully!' });
        this.initializeProjectData(this.projectId)
        this.fileInput.nativeElement.value = '';
        this.selectedFile = null;
      }, (error) => {
        this.fileInput.nativeElement.value = ''
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
      });
    }

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

  back() {
    this._location.back();
  }
}
