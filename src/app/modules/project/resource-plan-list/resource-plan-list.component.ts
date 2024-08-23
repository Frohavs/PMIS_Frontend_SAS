import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { ResourcePlanService } from 'src/app/services/resource-plan.service';
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
  dataList: any;
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
  selectedFile: File | null;

  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  // @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;
  @ViewChild('approveModal')
  approveModal: TemplateRef<any>;

  userModel: { id: number | null, name: string, role: number } = { id: null, name: '', role: 0 };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private inputSubscription: Subscription;
  @ViewChild('fileInput') fileInput: ElementRef;

  approveModelData: any = { accepted: true, notes: '', id: 0, approval: 1 };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private resourcePlanService: ResourcePlanService,
    private translate: TranslateService,
  ) {
    this.Add_text = this.translate.instant('BOQ.Add_Boq');
    this.Search_text = this.translate.instant('BOQ.Search');
  }

  ngOnInit(): void {
    this.getBoqId();
  }

  initializeProjectData(id: number, pageIndex?: number, search?: string) {
    this.resourcePlanService.getAll(id, pageIndex, search).subscribe(res => {
      this.dataList = res.data.items[0];
      this.approveModelData.id = this.dataList?.id;
      this.approveModelData.approval = !this.dataList?.approval ? 1 : this.dataList?.approval;

      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
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

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initializeProjectData(this.projectId, pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initializeProjectData(this.projectId, this.selected);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initializeProjectData(this.projectId, this.selected);
      }
    }
  }

  approveSCurve(approval: number) {
    if ((!approval || approval === 0  || approval === 1) && this.dataList.items.length) {
      this.modalService.open(this.approveModal, this.modalConfig);
    }
  }

  downloadTemplate() {
    window.open(this.resourcePlanService.downloadResourcePlan(this.projectId));
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
      this.resourcePlanService.uploadResourcePlanFile(this.projectId, fd).subscribe(res => {
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

  onSubmit() {
    this.approveModelData.approval = this.approveModelData.accepted === false ? 3 : this.approveModelData.approval + 1;
    delete this.approveModelData['accepted'];
    this.resourcePlanService.approve(this.approveModelData).subscribe(res => {
      this.showAlert({ icon: 'success', title: 'Success!', text: 's-curve approved successfully!' });
      this.modalService.dismissAll();
      this.approveModelData = { accepted: true, notes: '', id: this.dataList?.id, approval: 0 };
      this.initializeProjectData(this.projectId);
    }, () => {
      this.showAlert({ icon: 'error', title: 'Error!', text: 'please try again!' })
    });

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
