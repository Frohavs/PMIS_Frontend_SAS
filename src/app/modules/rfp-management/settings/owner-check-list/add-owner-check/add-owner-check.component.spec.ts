import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOwnerCheckComponent } from './add-owner-check.component';

describe('AddOwnerCheckComponent', () => {
  let component: AddOwnerCheckComponent;
  let fixture: ComponentFixture<AddOwnerCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOwnerCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOwnerCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
