import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeScheduleManagementComponent } from './time-schedule-management.component';

describe('TimeScheduleManagementComponent', () => {
  let component: TimeScheduleManagementComponent;
  let fixture: ComponentFixture<TimeScheduleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeScheduleManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeScheduleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
