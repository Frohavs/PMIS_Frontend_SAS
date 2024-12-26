import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyMeetingsComponent } from './monthly-meetings.component';

describe('MonthlyMeetingsComponent', () => {
  let component: MonthlyMeetingsComponent;
  let fixture: ComponentFixture<MonthlyMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyMeetingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlyMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
