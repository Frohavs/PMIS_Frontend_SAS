import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalDeliveryStatusComponent } from './final-delivery-status.component';

describe('FinalDeliveryStatusComponent', () => {
  let component: FinalDeliveryStatusComponent;
  let fixture: ComponentFixture<FinalDeliveryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalDeliveryStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalDeliveryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
