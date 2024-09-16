import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsultantEvalComponent } from './add-consultant-eval.component';

describe('AddConsultantEvalComponent', () => {
  let component: AddConsultantEvalComponent;
  let fixture: ComponentFixture<AddConsultantEvalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConsultantEvalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddConsultantEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
