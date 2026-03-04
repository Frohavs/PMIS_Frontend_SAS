import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { ProjectsService } from 'src/app/services/projects.service';

interface InvoiceStatusDummyItem {
  label: string;
  totalPercent: number;
  paidPercent: number;
}

interface DashboardCardsOverviewResponse {
  projectsOverview: {
    totalProjects: number;
    onGoingProjects: number;
    initialDeliveryProjects: number;
    offTrackProjects: number;
  };
  financialOverview: {
    totalOriginalValue: number;
    totalActualRevenue: number;
    revenueProgressPercentage: number;
    currentMonthActualRevenue: number;
    currentMonthRevenuePercentage: number;
  };
  usersOverview: {
    totalUsers: number;
    confirmedUsers: number;
    unconfirmedUsers: number;
  };
  vendorsOverview: {
    totalVendors: number;
    type2Vendors: number;
    type1Vendors: number;
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly invoiceTrendMonthKeys: string[] = [
    'CASHFLOW.January',
    'CASHFLOW.February',
    'CASHFLOW.March',
    'CASHFLOW.April',
    'CASHFLOW.May',
    'CASHFLOW.June',
    'CASHFLOW.July',
    'CASHFLOW.August',
    'CASHFLOW.September',
    'CASHFLOW.October',
    'CASHFLOW.November',
    'CASHFLOW.December',
  ];

  invoiceStatusDummy: InvoiceStatusDummyItem[] = [
    { label: 'Nov', totalPercent: 56, paidPercent: 32 },
    { label: 'Dec', totalPercent: 60, paidPercent: 38 },
    { label: 'Jan', totalPercent: 70, paidPercent: 50 },
    { label: 'Feb', totalPercent: 82, paidPercent: 62 },
    { label: 'Mar', totalPercent: 94, paidPercent: 73 },
    { label: 'Apr', totalPercent: 100, paidPercent: 80 },
  ];

  saudiMapCenter: google.maps.LatLngLiteral = { lat: 24.7136, lng: 46.6753 };
  saudiMapZoom = 12;
  saudiMapOptions: google.maps.MapOptions = {
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
  };
  saudiMarkerPosition: google.maps.LatLngLiteral = { lat: 24.7136, lng: 46.6753 };
  saudiMarkerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };

  @ViewChild('modal') private modalComponent: ModalComponent;
  dashboardCards: DashboardCardsOverviewResponse = this.getEmptyDashboardCards();
  private dashboardRetryCount = 0;
  private readonly maxDashboardRetries = 20;
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private readonly dashboardCacheKey = 'dashboard-cards-overview-cache';

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    const cached = this.getCachedDashboardCards();
    if (cached) {
      this.dashboardCards = cached;
    }

    this.dashboardRetryCount = 0;
    this.loadDashboardCardsOverview();
  }

  ngOnDestroy(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  private loadDashboardCardsOverview(): void {
    this.projectsService.getDashboardCardsOverview().subscribe({
      next: (res) => {
        if (!this.hasExpectedDashboardShape(res)) {
          this.retryLoadDashboardCardsOverview();
          return;
        }

        const mapped = this.mapDashboardCardsResponse(res);
        const looksEmpty = this.isAllZeroDashboardCards(mapped);
        if (looksEmpty) {
          this.retryLoadDashboardCardsOverview();
          return;
        }

        this.dashboardCards = mapped;
        this.cacheDashboardCards(mapped);
        this.dashboardRetryCount = 0;
      },
      error: () => {
        // Keep last successful values instead of replacing with zeros.
        this.retryLoadDashboardCardsOverview();
      }
    });
  }

  toNumber(value: any): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  formatCurrency(value: any): string {
    return new Intl.NumberFormat('en-US').format(this.toNumber(value));
  }

  private mapDashboardCardsResponse(res: any): DashboardCardsOverviewResponse {
    const root = res?.data ?? res?.Data ?? res ?? {};
    const projectsOverview = root?.projectsOverview ?? root?.ProjectsOverview ?? {};
    const financialOverview = root?.financialOverview ?? root?.FinancialOverview ?? {};
    const usersOverview = root?.usersOverview ?? root?.UsersOverview ?? {};
    const vendorsOverview = root?.vendorsOverview ?? root?.VendorsOverview ?? {};

    return {
      projectsOverview: {
        totalProjects: this.toNumber(projectsOverview?.totalProjects ?? projectsOverview?.TotalProjects),
        onGoingProjects: this.toNumber(projectsOverview?.onGoingProjects ?? projectsOverview?.OnGoingProjects),
        initialDeliveryProjects: this.toNumber(projectsOverview?.initialDeliveryProjects ?? projectsOverview?.InitialDeliveryProjects),
        offTrackProjects: this.toNumber(projectsOverview?.offTrackProjects ?? projectsOverview?.OffTrackProjects),
      },
      financialOverview: {
        totalOriginalValue: this.toNumber(financialOverview?.totalOriginalValue ?? financialOverview?.TotalOriginalValue),
        totalActualRevenue: this.toNumber(financialOverview?.totalActualRevenue ?? financialOverview?.TotalActualRevenue),
        revenueProgressPercentage: this.toNumber(financialOverview?.revenueProgressPercentage ?? financialOverview?.RevenueProgressPercentage),
        currentMonthActualRevenue: this.toNumber(financialOverview?.currentMonthActualRevenue ?? financialOverview?.CurrentMonthActualRevenue),
        currentMonthRevenuePercentage: this.toNumber(financialOverview?.currentMonthRevenuePercentage ?? financialOverview?.CurrentMonthRevenuePercentage),
      },
      usersOverview: {
        totalUsers: this.toNumber(usersOverview?.totalUsers ?? usersOverview?.TotalUsers),
        confirmedUsers: this.toNumber(usersOverview?.confirmedUsers ?? usersOverview?.ConfirmedUsers),
        unconfirmedUsers: this.toNumber(usersOverview?.unconfirmedUsers ?? usersOverview?.UnconfirmedUsers),
      },
      vendorsOverview: {
        totalVendors: this.toNumber(vendorsOverview?.totalVendors ?? vendorsOverview?.TotalVendors),
        type2Vendors: this.toNumber(vendorsOverview?.type2Vendors ?? vendorsOverview?.Type2Vendors),
        type1Vendors: this.toNumber(vendorsOverview?.type1Vendors ?? vendorsOverview?.Type1Vendors),
      },
    };
  }

  private hasExpectedDashboardShape(res: any): boolean {
    const root = res?.data ?? res?.Data ?? res;
    if (!root || typeof root !== 'object') {
      return false;
    }

    return !!(
      root.projectsOverview ||
      root.ProjectsOverview ||
      root.financialOverview ||
      root.FinancialOverview ||
      root.usersOverview ||
      root.UsersOverview ||
      root.vendorsOverview ||
      root.VendorsOverview
    );
  }

  private retryLoadDashboardCardsOverview(): void {
    if (this.dashboardRetryCount >= this.maxDashboardRetries) {
      return;
    }

    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }

    this.dashboardRetryCount += 1;
    const delayMs = Math.min(3000, 500 + (this.dashboardRetryCount * 250));
    this.retryTimeoutId = setTimeout(() => this.loadDashboardCardsOverview(), delayMs);
  }

  private isAllZeroDashboardCards(cards: DashboardCardsOverviewResponse): boolean {
    const values = [
      cards.projectsOverview.totalProjects,
      cards.projectsOverview.onGoingProjects,
      cards.projectsOverview.initialDeliveryProjects,
      cards.projectsOverview.offTrackProjects,
      cards.financialOverview.totalOriginalValue,
      cards.financialOverview.totalActualRevenue,
      cards.financialOverview.revenueProgressPercentage,
      cards.financialOverview.currentMonthActualRevenue,
      cards.financialOverview.currentMonthRevenuePercentage,
      cards.usersOverview.totalUsers,
      cards.usersOverview.confirmedUsers,
      cards.usersOverview.unconfirmedUsers,
      cards.vendorsOverview.totalVendors,
      cards.vendorsOverview.type2Vendors,
      cards.vendorsOverview.type1Vendors,
    ];

    return values.every(value => this.toNumber(value) === 0);
  }

  private cacheDashboardCards(cards: DashboardCardsOverviewResponse): void {
    localStorage.setItem(this.dashboardCacheKey, JSON.stringify(cards));
  }

  private getCachedDashboardCards(): DashboardCardsOverviewResponse | null {
    const raw = localStorage.getItem(this.dashboardCacheKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      const normalized = this.mapDashboardCardsResponse({ data: parsed });
      return this.isAllZeroDashboardCards(normalized) ? null : normalized;
    } catch {
      return null;
    }
  }

  private getEmptyDashboardCards(): DashboardCardsOverviewResponse {
    return {
      projectsOverview: {
        totalProjects: 0,
        onGoingProjects: 0,
        initialDeliveryProjects: 0,
        offTrackProjects: 0,
      },
      financialOverview: {
        totalOriginalValue: 0,
        totalActualRevenue: 0,
        revenueProgressPercentage: 0,
        currentMonthActualRevenue: 0,
        currentMonthRevenuePercentage: 0,
      },
      usersOverview: {
        totalUsers: 0,
        confirmedUsers: 0,
        unconfirmedUsers: 0,
      },
      vendorsOverview: {
        totalVendors: 0,
        type2Vendors: 0,
        type1Vendors: 0,
      },
    };
  }
}
