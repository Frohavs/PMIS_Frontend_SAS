import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialDeliveryListComponent } from './initial-delivery-list.component';

describe('InitialDeliveryListComponent', () => {
  let component: InitialDeliveryListComponent;
  let fixture: ComponentFixture<InitialDeliveryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialDeliveryListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitialDeliveryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
