import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { BoqService } from 'src/app/services/boq.service';
import { SweetAlertOptions } from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrl: './cash-flow.component.scss'
})
export class CashFlowComponent implements OnInit, AfterViewInit, OnDestroy {
  projectId: number;

  Add_text: string;
  Search_text: string;
  dataList: any[] = [];
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;

  selectedFile: File;
  @ViewChild('fileModal') fileModal: TemplateRef<any>;

  userModel: { id: number | null, name: string, role: number } = { id: null, name: '', role: 0 };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  private inputSubscription: Subscription;

  constructor(
    private router: Router,
    private elRef: ElementRef,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private boqService: BoqService,
    private translate: TranslateService,
    private modalService: NgbModal
  ) {
    this.Add_text = this.translate.instant('BOQ.Add_Boq');
    this.Search_text = this.translate.instant('BOQ.Search');
  }

  ngOnInit(): void {
    this.getProjectId()
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

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        // this.initializeProjectData(this.projectId)
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
    this.modalService.open(this.fileModal, this.modalConfig)
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initializeProjectData(this.projectId, pageIndex, '');
  }

  onSendFile(event: Event, myForm: NgForm) {
    if (!this.selectedFile) {
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.modalService.dismissAll()
      this.router.navigateByUrl('projects/add-cash-flow' + `/${this.projectId}`)
    }, 1500);
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    // const fd = new FormData();
    // fd.append('Attachment', this.selectedFile, this.selectedFile.name);
    // this.attachmentService.uploadAttachment(fd).subscribe(res => {
    //   this.EotModel['eotAttachment'] = this.selectedFile.name;
    // });
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
