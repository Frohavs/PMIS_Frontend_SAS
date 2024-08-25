import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { debounceTime, distinctUntilChanged, fromEvent, Subscription } from 'rxjs';
import { SubContractorsService } from 'src/app/services/sub-contractors.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-sub-contractors',
  templateUrl: './sub-contractors.component.html',
  styleUrl: './sub-contractors.component.scss'
})
export class SubContractorsComponent implements OnInit, AfterViewInit, OnDestroy {

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
      private subContractorsService: SubContractorsService
    ) {
      this.Add_text = this.translate.instant('SubContractors.Add_Contractor');
      this.Search_text = this.translate.instant('SubContractors.Search');
    }

    ngOnInit(): void {
      this.getProjectId();
      this.initLettersList(this.projectId);
    }

    getProjectId() {
      this.activatedRoute.params.subscribe(params => {
        this.projectId = +params['id'];
      });
    }

    initLettersList(id: number, pageIndex?: number, search?: string) {
      this.dataList = [];
      // this.subContractorsService.getAll(id, pageIndex, search).subscribe(res => {
      //   this.dataList = res?.data?.items;
      //   this.totalCount = res?.data?.totalcount;
      //   this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      //   this.cdr.detectChanges();
      // });
    }

    ngAfterViewInit(): void {
      const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

      this.inputSubscription = fromEvent(inputElement, 'input').pipe(
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe((event: any) => {
        const searchText = event.target.value;
        this.initLettersList(1, searchText)
      });
    }

    redirectToNew() {
      this.router.navigateByUrl('projects/add-sub-contractor/' + this.projectId)
    }

    contractorDetails(letter: any) {
      this.router.navigate(['projects/sub-contractor-details/' + this.projectId], {
        queryParams: { letterId: letter.id }
      });
    }

    deleteContractor(user: any) {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this.isLoading = true;
          this.subContractorsService.deleteContractor(user.id).subscribe({
            next: (res) => {
              this.showAlert({ icon: 'success', title: 'Success!', text: 'Letter Deleted successfully!' });
              setTimeout(() => {
                this.isLoading = false;
                this.dataList = [];
                this.initLettersList(this.projectId, );
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

    navigatePage(pageIndex: number) {
      this.selected = pageIndex;
      this.initLettersList(this.projectId, pageIndex, '');
    }

    navigateArrows(next: boolean) {
      if(next) {
        if (this.selected === this.pagesCount.length) {
          return;
        } else {
          this.selected += 1;
          this.initLettersList(this.projectId, this.selected, '');
        }
      } else {
        if (this.selected === 1) {
          return;
        } else {
          this.selected -= 1;
          this.initLettersList(this.projectId, this.selected, '');
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
