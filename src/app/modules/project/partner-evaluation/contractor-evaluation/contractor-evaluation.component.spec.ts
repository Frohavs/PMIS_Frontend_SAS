import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorEvaluationComponent } from './contractor-evaluation.component';

describe('ContractorEvaluationComponent', () => {
  let component: ContractorEvaluationComponent;
  let fixture: ComponentFixture<ContractorEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
