import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription, fromEvent, debounceTime, distinctUntilChanged } from 'rxjs';
import { CriticalPathService } from 'src/app/services/critical-path.service';
import { SweetAlertOptions } from 'sweetalert2';
import { ProjectLettersService } from 'src/app/services/project-letters.service';

@Component({
  selector: 'app-project-letters',
  templateUrl: './project-letters.component.html',
  styleUrl: './project-letters.component.scss'
})
export class ProjectLettersComponent implements OnInit, AfterViewInit, OnDestroy {

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
    private lettersService: ProjectLettersService
  ) {
    this.Add_text = this.translate.instant('LETTERS.Add_Letter');
    this.Search_text = this.translate.instant('LETTERS.Search');
  }

  ngOnInit(): void {
    this.getProjectId();
    this.initializeMilesStoneList();
  }

  initializeMilesStoneList(pageIndex?: number, search?: string) {
    this.dataList = [];
    this.lettersService.getAll(this.projectId, pageIndex, search).subscribe(res => {
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
      this.initializeMilesStoneList(1, searchText)
    });
  }

  getProjectId() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = +params['id'];
    });
  }

  redirectToNew() {
    this.router.navigateByUrl('projects/add-project-letter/' + this.projectId)
  }

  editLetter(letter: any) {
    this.router.navigate(['projects/project-letter-details/' + this.projectId], {
      queryParams: { pathId: letter.id }
    });
  }

  deleteLetter(letter: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.lettersService.deleteLetter(letter.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Letter Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initializeMilesStoneList();
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
    this.initializeMilesStoneList(pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if(next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initializeMilesStoneList(this.selected, '');
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initializeMilesStoneList(this.selected, '');
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
