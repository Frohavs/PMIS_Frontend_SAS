import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCashFlowComponent } from './add-cash-flow.component';

describe('AddCashFlowComponent', () => {
  let component: AddCashFlowComponent;
  let fixture: ComponentFixture<AddCashFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCashFlowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCashFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
