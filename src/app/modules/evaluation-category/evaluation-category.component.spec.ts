import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationCategoryComponent } from './evaluation-category.component';

describe('EvaluationCategoryComponent', () => {
  let component: EvaluationCategoryComponent;
  let fixture: ComponentFixture<EvaluationCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
