import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';
import { MirService } from 'src/app/services/mir.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-mir-list',
  templateUrl: './mir-list.component.html',
  styleUrl: './mir-list.component.scss'
})
export class MirListComponent implements OnInit, AfterViewInit, OnDestroy {

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
    private translate: TranslateService,
    private mirService: MirService
  ) {
    this.Add_text = 'Create';
    this.Search_text = this.translate.instant('FACTORY.Search');
  }

  ngOnInit(): void {
    this.getProjectId();
  }

  initFactoryList(id: number, pageIndex?: number, search?: string) {
    this.dataList = [];
    this.mirService.getAll(id, pageIndex, search).subscribe(res => {
      this.dataList = res?.data?.items;
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

    this.inputSubscription = fromEvent(inputElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      const searchText = event.target.value;
      this.initFactoryList(1, searchText)
    });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
      this.initFactoryList(this.projectId);
    });
  }

  redirectToNew() {
    this.router.navigateByUrl('projects/add-mir/' + this.projectId)
  }

  factoryDetails(factory: any) {
    this.router.navigate(['projects/mir-derails/' + this.projectId], {
      queryParams: { factoryId: factory.id }
    });
  }


  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initFactoryList(this.projectId, pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if(next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initFactoryList(this.projectId, this.selected);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initFactoryList(this.projectId, this.selected);
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
