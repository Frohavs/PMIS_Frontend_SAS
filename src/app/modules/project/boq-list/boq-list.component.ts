import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BoqService } from 'src/app/services/boq.service';
import { SweetAlertOptions } from 'sweetalert2';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';

@Component({
  selector: 'app-boq-list',
  templateUrl: './boq-list.component.html',
  styleUrl: './boq-list.component.scss'
})
export class BoqListComponent implements OnInit, AfterViewInit, OnDestroy {
  projectId: number;

  Add_text: string;
  Search_text: string;
  dataList: any[] = [];
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
  boqTemplate: string;

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
    this.getBoqId();
    this.attachmentService.downloadBoqAttachment().subscribe(res => {
      this.boqTemplate = res.data;
    })
  }

  ngAfterViewInit(): void {
    const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

    this.inputSubscription = fromEvent(inputElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      const searchText = event.target.value;
      // console.log(event.target.value);
      this.initializeProjectData(this.projectId, 1, searchText)
    });
  }

  initializeProjectData(id: number, pageIndex?: number, search?: string) {
    this.boqService.getAll(id, pageIndex, search).subscribe(res => {
      this.dataList = res.data.items;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  getBoqId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.initializeProjectData(this.projectId)
      }
    });
  }

  checkAll(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    this.dataList.forEach(project => {
      project.checked = isChecked ? true : false;
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
              this.initializeProjectData(this.projectId);
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

  redirectToNew() {
    this.router.navigateByUrl('projects/add-boq' + `/${this.projectId}`)
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initializeProjectData(this.projectId, pageIndex, '');
  }

  downloadTemplate() {
    window.open(this.boqTemplate);
  }

  uploadTemplate(event: Event) {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fd = new FormData();
      fd.append('file', file, file.name);

      this.boqService.uploadBoqFile(fd).subscribe(res => {
        this.showAlert({ icon: 'success', title: 'Success!', text: 'file Uploaded successfully!' });
        this.initializeProjectData(this.projectId)
        this.fileInput.nativeElement.value = '';
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
