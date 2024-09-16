import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEvalCategoryComponent } from './add-eval-category.component';

describe('AddEvalCategoryComponent', () => {
  let component: AddEvalCategoryComponent;
  let fixture: ComponentFixture<AddEvalCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEvalCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEvalCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
