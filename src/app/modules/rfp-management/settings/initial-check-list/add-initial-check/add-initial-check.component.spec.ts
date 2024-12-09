import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInitialCheckComponent } from './add-initial-check.component';

describe('AddInitialCheckComponent', () => {
  let component: AddInitialCheckComponent;
  let fixture: ComponentFixture<AddInitialCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInitialCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddInitialCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
