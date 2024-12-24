import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpReportComponent } from './rfp-report.component';

describe('RfpReportComponent', () => {
  let component: RfpReportComponent;
  let fixture: ComponentFixture<RfpReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfpReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfpReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
