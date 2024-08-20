import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { BoqService } from 'src/app/services/boq.service';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-resource-plan-list',
  templateUrl: './resource-plan-list.component.html',
  styleUrl: './resource-plan-list.component.scss'
})
export class ResourcePlanListComponent implements OnInit, OnDestroy {
  projectId: number;

  Add_text: string;
  Search_text: string;
  dataList: any[] = [];
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
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

  private inputSubscription: Subscription;

  constructor(
    private router: Router,
    private elRef: ElementRef,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private boqService: BoqService,
    private attachmentService: AttachmentService,
    private translate: TranslateService,
  ) {
    this.Add_text = this.translate.instant('BOQ.Add_Boq');
    this.Search_text = this.translate.instant('BOQ.Search');
  }

  ngOnInit(): void {
    this.getProjectId();
    this.attachmentService.downloadSCurveAttachment().subscribe(res => {
      this.sCurveTemplate = res.data;
    })
  }

  ngAfterViewInit(): void {
    const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

    this.inputSubscription = fromEvent(inputElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      const searchText = event.target.value;
      this.initResourceListData(this.projectId, 1, searchText)
    });
  }

  initResourceListData(id: number, pageIndex?: number, search?: string) {
    this.dataList = [];
    // this.boqService.getAll(id, pageIndex, search).subscribe(res => {
    //   this.totalCount = res?.data?.totalcount;
    //   this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
    //   this.cdr.detectChanges();
    // });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.initResourceListData(this.projectId)
      }
    });
  }

  checkUser(event: Event, id: string) {
    // const isChecked = (<HTMLInputElement>event.target).checked;
  }

  editBoq(boq: any) {
    this.router.navigate([`projects/add-boq/${this.projectId}`], {
      queryParams: { boqId: boq.id }
    });
  }

  deleteBoq(boq: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.boqService.deleteBoq(boq.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Boq Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initResourceListData(this.projectId);
            }, 500);
          },
          error: (error) => {
            this.isLoading = false;
            this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
          }
        });
      }
    });
  }

  approveSCurve() {
    // this.router.navigateByUrl('projects/add-boq' + `/${this.projectId}`)
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initResourceListData(this.projectId, pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initResourceListData(this.projectId, this.selected);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initResourceListData(this.projectId, this.selected);
      }
    }
  }

  downloadTemplate() {
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
      this.boqService.uploadBoqFile(this.projectId, fd).subscribe(res => {
        this.showAlert({ icon: 'success', title: 'Success!', text: 'file Uploaded successfully!' });
        this.initResourceListData(this.projectId)
        this.fileInput.nativeElement.value = '';
        this.selectedFile = null;
      }, (error) => {
        this.fileInput.nativeElement.value = ''
        this.showAlert({ icon: 'error', title: 'Error!', text: 'Please try again' });
      });
    }

  }

  ngOnDestroy(): void {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
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
