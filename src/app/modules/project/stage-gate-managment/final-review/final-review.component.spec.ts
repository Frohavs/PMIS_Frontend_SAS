import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalReviewComponent } from './final-review.component';

describe('FinalReviewComponent', () => {
  let component: FinalReviewComponent;
  let fixture: ComponentFixture<FinalReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
