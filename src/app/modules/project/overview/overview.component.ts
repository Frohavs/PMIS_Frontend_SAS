import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
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
export class OverviewComponent implements OnInit, OnDestroy {
  dataList: any[] = []
  allDataList: any[] = [];
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
  searchTerm = '';
  sectorFilter = '';
  sortBy: 'startDate' | 'name' = 'startDate';


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
    private modalService: NgbModal,
    private translate: TranslateService,
    private projectsService: ProjectsService,
    private deliveryStatusService: DeliveryStatusService,
  ) {
  }

  ngOnInit(): void {
    this.initializeProjectData();
  }

  initializeProjectData(pageIndex?: number, search?: string) {
    this.projectsService.getAll(pageIndex, search).subscribe(res => {
      this.dataList = res?.data?.items || [];
      this.totalCount = res?.data?.totalcount || 0;
      this.pagesCount = Array.from({ length: Math.ceil(this.totalCount / 10) }, (_, index) => index + 1);
      this.cdr.detectChanges();
    });

    this.projectsService.getAllProjects(1, search).subscribe(res => {
      this.allDataList = res?.data?.items || [];
      this.cdr.detectChanges();
    });
  }

  checkAll(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    this.dataList.forEach(project => {
      project.checked = isChecked ? true : false;
    });
  }

  get filteredProjects(): any[] {
    let rows = [...(this.dataList || [])];

    if (this.searchTerm.trim()) {
      const key = this.searchTerm.trim().toLowerCase();
      rows = rows.filter(project =>
        (project?.nameAr || '').toLowerCase().includes(key) ||
        (project?.name || '').toLowerCase().includes(key) ||
        (project?.consultantName || '').toLowerCase().includes(key) ||
        (project?.projectSectorName || '').toLowerCase().includes(key)
      );
    }

    if (this.sectorFilter) {
      rows = rows.filter(project => (project?.projectSectorName || '') === this.sectorFilter);
    }

    rows.sort((a, b) => {
      if (this.sortBy === 'name') {
        return this.getProjectDisplayName(a).localeCompare(this.getProjectDisplayName(b), undefined, { numeric: true, sensitivity: 'base' });
      }

      const aDate = a?.executionStartDate ? new Date(a.executionStartDate).getTime() : 0;
      const bDate = b?.executionStartDate ? new Date(b.executionStartDate).getTime() : 0;
      return bDate - aDate;
    });

    return rows;
  }

  get sectors(): string[] {
    const names = (this.allDataList || [])
      .map(project => project?.projectSectorName)
      .filter((value: string | undefined) => !!value);
    return Array.from(new Set(names));
  }

  get totalProjectsCount(): number {
    return (this.allDataList || []).length;
  }

  get ongoingProjectsCount(): number {
    return this.countByStage(['ongoing', 'on going', 'on_going', 'جاري']);
  }

  get initialDeliveryProjectsCount(): number {
    return this.countByStage(['initial', 'delivery', 'ابتد']);
  }

  get offTrackProjectsCount(): number {
    return this.countByStage(['off track', 'off_track', 'متعثر', 'خارج']);
  }

  get prospectiveProjectsCount(): number {
    return this.countByStage(['prospective', 'مستقب']);
  }

  get ongoingPercent(): number {
    return this.getPercent(this.ongoingProjectsCount);
  }

  get initialPercent(): number {
    return this.getPercent(this.initialDeliveryProjectsCount);
  }

  get offTrackPercent(): number {
    return this.getPercent(this.offTrackProjectsCount);
  }

  get prospectivePercent(): number {
    return this.getPercent(this.prospectiveProjectsCount);
  }

  get studyDesignPercent(): number {
    return this.getPercent(this.countByClassification(['study and design', 'دراسة']));
  }

  get supervisorPercent(): number {
    return this.getPercent(this.countByClassification(['supervisor', 'إشراف']));
  }

  get excusePercent(): number {
    return this.getPercent(this.countByClassification(['excuse', 'execuse']));
  }

  get consultantServicesPercent(): number {
    return this.getPercent(this.countByClassification(['consultant services', 'استشار']));
  }

  get upcomingMilestones(): any[] {
    return [...(this.allDataList || [])]
      .filter(project => !!project?.executionStartDate)
      .sort((a, b) => {
        const aDate = new Date(a.executionStartDate).getTime();
        const bDate = new Date(b.executionStartDate).getTime();
        return aDate - bDate;
      })
      .slice(0, 5);
  }

  get totalBudgetValue(): number {
    return (this.allDataList || []).reduce((sum, item) => sum + this.toNumber(
      item?.projectValue ?? item?.contractValue ?? item?.budget ?? 0
    ), 0);
  }

  get avgProgressValue(): number {
    const values = (this.allDataList || [])
      .map(item => this.toNumber(item?.actualPercentage ?? item?.plannedPercentage ?? item?.progress ?? item?.progressPercentage ?? item?.completionPercentage))
      .filter(value => value >= 0);

    if (!values.length) {
      return 0;
    }

    const total = values.reduce((sum, current) => sum + current, 0);
    return Math.round(total / values.length);
  }

  get highRiskProjectsCount(): number {
    return (this.allDataList || []).filter(item => {
      return this.toNumber(item?.totalRisk) > 0;
    }).length;
  }

  getProjectDisplayName(project: any): string {
    return project?.nameAr || project?.name || '--';
  }

  getProjectStatusText(project: any): string {
    return project?.stage || project?.projectStageName || project?.projectStatusName || project?.stageName || '--';
  }

  getProjectStatusClass(project: any): string {
    const status = this.getProjectStatusText(project).toLowerCase();
    if (status.includes('off') || status.includes('متعثر') || status.includes('خارج')) {
      return 'status-off-track';
    }
    if (status.includes('initial') || status.includes('delivery') || status.includes('ابتد')) {
      return 'status-initial';
    }
    if (status.includes('prospective') || status.includes('مستقب')) {
      return 'status-prospective';
    }
    return 'status-ongoing';
  }

  getProgressValue(project: any): number {
    const value = this.toNumber(project?.actualPercentage ?? project?.plannedPercentage ?? project?.progress ?? project?.progressPercentage ?? project?.completionPercentage);
    return Math.max(0, Math.min(100, value));
  }

  getActualProgressValue(project: any): number {
    const value = this.toNumber(project?.actualPercentage);
    return Math.max(0, Math.min(100, value));
  }

  getPlannedProgressValue(project: any): number {
    const value = this.toNumber(project?.plannedPercentage);
    return Math.max(0, Math.min(100, value));
  }

  onSearchTermChange(term: string): void {
    this.searchTerm = term || '';
    this.selected = 1;
    this.initializeProjectData(1, this.searchTerm);
  }

  countByStage(keywords: string[]): number {
    return (this.allDataList || []).filter(item => {
      const stage = `${item?.stage || ''} ${item?.projectStageName || ''} ${item?.projectStatusName || ''} ${item?.stageName || ''}`.toLowerCase();
      return keywords.some(keyword => stage.includes(keyword));
    }).length;
  }

  countByClassification(keywords: string[]): number {
    return (this.allDataList || []).filter(item => {
      const classification = `${item?.projectClassification || ''}`.toLowerCase();
      return keywords.some(keyword => classification.includes(keyword));
    }).length;
  }

  toNumber(value: any): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  getPercent(value: number): number {
    if (!this.totalProjectsCount) {
      return 0;
    }

    return Math.round((value / this.totalProjectsCount) * 100);
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
          this.getLocalizedText(option.name).toLowerCase().includes(searchKey) ||
          this.getLocalizedText(option.description).toLowerCase().includes(searchKey)
        )
      }))
      .filter(section => section.options.length > 0);
  }

  getLocalizedText(value: string): string {
    if (!value) {
      return '';
    }

    const parts = value.split('|').map(part => part.trim());
    if (parts.length < 2) {
      return value;
    }

    const currentLang = this.translate.currentLang || localStorage.getItem('language') || this.translate.getDefaultLang() || 'en';
    return currentLang === 'ar' ? (parts[1] || parts[0]) : parts[0];
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
    this.initializeProjectData(pageIndex, this.searchTerm);
  }

  navigateArrows(next: boolean) {
    if (next) {
      if (this.selected === this.pagesCount.length) {
        return;
      } else {
        this.selected += 1;
        this.initializeProjectData(this.selected, this.searchTerm);
      }
    } else {
      if (this.selected === 1) {
        return;
      } else {
        this.selected -= 1;
        this.initializeProjectData(this.selected, this.searchTerm);
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
