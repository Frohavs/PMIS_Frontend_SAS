import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractorEvalComponent } from './add-contractor-eval.component';

describe('AddContractorEvalComponent', () => {
  let component: AddContractorEvalComponent;
  let fixture: ComponentFixture<AddContractorEvalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContractorEvalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddContractorEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
