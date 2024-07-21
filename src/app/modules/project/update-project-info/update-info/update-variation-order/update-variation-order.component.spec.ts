import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVariationOrderComponent } from './update-variation-order.component';

describe('UpdateVariationOrderComponent', () => {
  let component: UpdateVariationOrderComponent;
  let fixture: ComponentFixture<UpdateVariationOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateVariationOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateVariationOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
