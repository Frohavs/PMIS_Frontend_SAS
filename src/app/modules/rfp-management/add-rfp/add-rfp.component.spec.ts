import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRfpComponent } from './add-rfp.component';

describe('AddRfpComponent', () => {
  let component: AddRfpComponent;
  let fixture: ComponentFixture<AddRfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRfpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
