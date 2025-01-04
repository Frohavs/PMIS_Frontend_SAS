import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepDetailsComponent } from './step-details.component';

describe('StepDetailsComponent', () => {
  let component: StepDetailsComponent;
  let fixture: ComponentFixture<StepDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StepDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
