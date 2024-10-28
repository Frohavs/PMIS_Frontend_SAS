import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStatusReportComponent } from './project-status-report.component';

describe('ProjectStatusReportComponent', () => {
  let component: ProjectStatusReportComponent;
  let fixture: ComponentFixture<ProjectStatusReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStatusReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
