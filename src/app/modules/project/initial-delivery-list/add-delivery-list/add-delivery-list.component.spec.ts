import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryListComponent } from './add-delivery-list.component';

describe('AddDeliveryListComponent', () => {
  let component: AddDeliveryListComponent;
  let fixture: ComponentFixture<AddDeliveryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDeliveryListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDeliveryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
