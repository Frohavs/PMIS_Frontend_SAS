import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorEvalDetailsComponent } from './contractor-eval-details.component';

describe('ContractorEvalDetailsComponent', () => {
  let component: ContractorEvalDetailsComponent;
  let fixture: ComponentFixture<ContractorEvalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorEvalDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorEvalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
