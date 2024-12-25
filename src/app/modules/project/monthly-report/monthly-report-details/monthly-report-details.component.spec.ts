import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyReportDetailsComponent } from './monthly-report-details.component';

describe('MonthlyReportDetailsComponent', () => {
  let component: MonthlyReportDetailsComponent;
  let fixture: ComponentFixture<MonthlyReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyReportDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlyReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
