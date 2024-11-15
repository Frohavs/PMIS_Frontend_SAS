import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialDeliveryStatusComponent } from './initial-delivery-status.component';

describe('InitialDeliveryStatusComponent', () => {
  let component: InitialDeliveryStatusComponent;
  let fixture: ComponentFixture<InitialDeliveryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialDeliveryStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitialDeliveryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
