import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KickoffMeetingComponent } from './kickoff-meeting.component';

describe('KickoffMeetingComponent', () => {
  let component: KickoffMeetingComponent;
  let fixture: ComponentFixture<KickoffMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KickoffMeetingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KickoffMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
