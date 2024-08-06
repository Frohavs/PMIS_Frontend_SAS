import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashFlowDetailsComponent } from './cash-flow-details.component';

describe('CashFlowDetailsComponent', () => {
  let component: CashFlowDetailsComponent;
  let fixture: ComponentFixture<CashFlowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashFlowDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashFlowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
