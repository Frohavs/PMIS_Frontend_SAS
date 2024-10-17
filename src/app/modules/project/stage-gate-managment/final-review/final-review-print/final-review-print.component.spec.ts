import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalReviewPrintComponent } from './final-review-print.component';

describe('FinalReviewPrintComponent', () => {
  let component: FinalReviewPrintComponent;
  let fixture: ComponentFixture<FinalReviewPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalReviewPrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalReviewPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
