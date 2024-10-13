import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMeetingComponent } from './review-meeting.component';

describe('ReviewMeetingComponent', () => {
  let component: ReviewMeetingComponent;
  let fixture: ComponentFixture<ReviewMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewMeetingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
