import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffEvaluationComponent } from './staff-evaluation.component';

describe('StaffEvaluationComponent', () => {
  let component: StaffEvaluationComponent;
  let fixture: ComponentFixture<StaffEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StaffEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
