import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantEvalDetailsComponent } from './consultant-eval-details.component';

describe('ConsultantEvalDetailsComponent', () => {
  let component: ConsultantEvalDetailsComponent;
  let fixture: ComponentFixture<ConsultantEvalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantEvalDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultantEvalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
