import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KickoffMeetingSubmitComponent } from './kickoff-meeting-submit.component';

describe('KickoffMeetingSubmitComponent', () => {
  let component: KickoffMeetingSubmitComponent;
  let fixture: ComponentFixture<KickoffMeetingSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KickoffMeetingSubmitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KickoffMeetingSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
