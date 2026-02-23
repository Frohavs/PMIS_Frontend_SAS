import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { PROJECT_OPTION_SECTIONS, ProjectOptionSection } from './project-options';
import { ProjectsService } from 'src/app/services/projects.service';
import { DeliveryStatusService } from 'src/app/services/delivery-status.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  Add_text: string;
  Search_text: string;
  dataList: any[] = []
  totalCount: number;
  pagesCount: number[] = [];
  selected = 1;
  selectedSettingId: number | null;
  selectedProjectName = '';
  modalSearchText = '';
  projectOptionSections: ProjectOptionSection[] = PROJECT_OPTION_SECTIONS;
  filteredProjectOptionSections: ProjectOptionSection[] = PROJECT_OPTION_SECTIONS;
  optionCounts: Record<string, number> = {
    'projects/rfi-list': 0,
  };


  // modal configs
  isLoading = false;
  isCollapsed1 = false;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;

  @ViewChild('deleteSwal') public readonly deleteSwal!: SwalComponent;

  @ViewChild('SettingsModal')
  SettingsModal: TemplateRef<any>;

  userModel: { id: number | null, name: string, role: number } = { id: null, name: '', role: 0 };
  modalConfig: NgbModalOptions = {
  modalDialogClass: 'modal-dialog-centered project-workspace-modal',
  };

  private inputSubscription: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private elRef: ElementRef,
    private modalService: NgbModal,
    private translate: TranslateService,
    private projectsService: ProjectsService,
    private deliveryStatusService: DeliveryStatusService,
  ) {
    this.Add_text = this.translate.instant('PROJECTS.Add_Project');
    this.Search_text = this.translate.instant('PROJECTS.Search');
  }

  ngOnInit(): void {
    this.initializeProjectData();
  }

  ngAfterViewInit(): void {
    const inputElement = this.elRef.nativeElement.querySelector('input[data-action="filter"]');

    this.inputSubscription = fromEvent(inputElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((event: any) => {
      const searchText = event.target.value;
      this.initializeProjectData(1, '')
    });
  }

  initializeProjectData(pageIndex?: number, search?: string) {
    this.projectsService.getAll(pageIndex, search).subscribe(res => {
      this.dataList = res?.data?.items;
      this.totalCount = res?.data?.totalcount;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });
  }

  checkAll(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    this.dataList.forEach(project => {
      project.checked = isChecked ? true : false;
    });
  }

   checkProject(id: number, projectName?: string) {
    this.selectedSettingId = id;
    this.selectedProjectName = projectName || 'Project Workspace';
    this.modalSearchText = '';
    this.filteredProjectOptionSections = this.projectOptionSections;
    this.modalService.open(this.SettingsModal, this.modalConfig);
  }

  onModalSearchChange(): void {
    const searchKey = this.modalSearchText.trim().toLowerCase();
    if (!searchKey) {
      this.filteredProjectOptionSections = this.projectOptionSections;
      return;
    }

    this.filteredProjectOptionSections = this.projectOptionSections
      .map(section => ({
        ...section,
        options: section.options.filter(option =>
          option.name.toLowerCase().includes(searchKey) ||
          option.description.toLowerCase().includes(searchKey)
        )
      }))
      .filter(section => section.options.length > 0);
  }

  getOptionCount(route: string, defaultCount?: number): number | null {
    if (this.optionCounts[route] !== undefined) {
      return this.optionCounts[route];
    }

    return defaultCount ?? null;
  }


  redirectToNew() {
    this.router.navigateByUrl('projects/create')
  }

  editProject(project: any) {
    this.router.navigateByUrl('projects/edit/' + project.id)
  }

  deleteProject(project: any) {
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.isLoading = true;
        this.projectsService.deleteProject(project.id).subscribe({
          next: (res) => {
            this.showAlert({ icon: 'success', title: 'Success!', text: 'Project Deleted successfully!' });
            setTimeout(() => {
              this.isLoading = false;
              this.dataList = [];
              this.initializeProjectData();
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

  navigateTo(route: string) {
    if (route === 'projects/initial-delivery-status') {
      this.deliveryStatusService.getDeliveryStatusById(this.selectedSettingId, 1).subscribe(res => {
        if (res === null) {
          this.deliveryStatusService.createDeliveryStatus({ projectId: this.selectedSettingId, type: 1 }).subscribe(res => {
            this.router.navigate([route + `/${this.selectedSettingId}`], {
              queryParams: {
                statusId: res.data
              }
            });
            this.modalService.dismissAll();
            this.selectedSettingId = null;
          });
        } else {
          this.router.navigate([route + `/${this.selectedSettingId}`], {
            queryParams: {
              statusId: res.data.id
            }
          });
          this.modalService.dismissAll();
          this.selectedSettingId = null;
        }
      });
    } else if (route === 'projects/final-delivery-status') {
      this.deliveryStatusService.getDeliveryStatusById(this.selectedSettingId, 2).subscribe(res => {
        if (res === null) {
          this.deliveryStatusService.createDeliveryStatus({ projectId: this.selectedSettingId, type: 2 }).subscribe(res => {
            this.router.navigate([route + `/${this.selectedSettingId}`], {
              queryParams: {
                statusId: res.data
              }
            });
            this.modalService.dismissAll();
            this.selectedSettingId = null;
          });
        } else {
          this.router.navigate([route + `/${this.selectedSettingId}`], {
            queryParams: {
              statusId: res.data.id
            }
          });
          this.modalService.dismissAll();
          this.selectedSettingId = null;
        }
      });


    } else {
      this.router.navigateByUrl(route + `/${this.selectedSettingId}`);
      this.modalService.dismissAll();
      this.selectedSettingId = null;

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

  navigatePage(pageIndex: number) {
    this.selected = pageIndex;
    this.initializeProjectData(pageIndex, '');
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initializeProjectData(this.selected);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initializeProjectData(this.selected);
      }
    }
  }

  checkAdmin(userName: string) {
    return userName === 'SuperAdmin' ? false : true;
  }

  ngOnDestroy(): void {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }
}
