import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitAcknowledgementComponent } from './commit-acknowledgement.component';

describe('CommitAcknowledgementComponent', () => {
  let component: CommitAcknowledgementComponent;
  let fixture: ComponentFixture<CommitAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitAcknowledgementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommitAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
