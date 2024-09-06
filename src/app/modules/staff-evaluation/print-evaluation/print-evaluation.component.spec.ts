import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintEvaluationComponent } from './print-evaluation.component';

describe('PrintEvaluationComponent', () => {
  let component: PrintEvaluationComponent;
  let fixture: ComponentFixture<PrintEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintEvaluationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
