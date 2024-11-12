import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { HseService } from 'src/app/services/hse.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-hse-finding',
  templateUrl: './hse-finding.component.html',
  styleUrl: './hse-finding.component.scss'
})
export class HseFindingComponent implements OnInit, AfterViewInit, OnDestroy {
  projectId: number;
  hseId: number;
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

  userModel: { id: number | null, name: string, role: number } = { id: null, name: '', role: 0 };
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  private inputSubscription: Subscription;
  constructor(
    private router: Router,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private hseService: HseService
  ) {
    this.Add_text = this.translate.instant('Project_files.Add_New');
    this.Search_text = this.translate.instant('Project_files.Search');
  }

  ngOnInit(): void {
    this.getProjectId();
  }

  ngAfterViewInit(): void {
    const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

    this.inputSubscription = fromEvent(inputElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      const searchText = event.target.value;
      this.initFindingData(this.projectId, 1, searchText)
    });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      this.initFindingData(this.projectId);
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.projectId = +params['hseId'];
    });
  }

  initFindingData(id: number, pageIndex?: number, search?: string) {
    this.hseService.getFindingsById(id, pageIndex, search).subscribe(res => {
      this.totalCount = res?.data?.totalcount;
      this.dataList = res.data.items;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  navigateFinding(finding: any) {
    this.router.navigate([`projects/hse-finding/${this.projectId}`], {
      queryParams: { findingId: finding.id }
    });
  }

  redirectToNew() {
    this.router.navigateByUrl(`projects/hse-finding-create/${this.projectId}`);
  }
  editAttachment(File: any) {
    this.router.navigate([`projects/hse-edit/${File.projectId}`], {
      queryParams: { fileId: File.id }
    });
  }

  deleteAttachment(File: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.hseService.deleteVendor(File.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Project Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initFindingData(this.projectId,);
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

  navigateTo(event: any) {
    const route = event?.target.value;
    this.router.navigateByUrl(route + `/${'123'}`)
  }

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initFindingData(this.projectId, pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initFindingData(this.projectId, this.selected, '');
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initFindingData(this.projectId, this.selected, '');
      }
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

}
