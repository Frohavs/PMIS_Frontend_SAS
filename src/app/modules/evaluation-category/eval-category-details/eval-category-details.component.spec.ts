import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalCategoryDetailsComponent } from './eval-category-details.component';

describe('EvalCategoryDetailsComponent', () => {
  let component: EvalCategoryDetailsComponent;
  let fixture: ComponentFixture<EvalCategoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvalCategoryDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvalCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
