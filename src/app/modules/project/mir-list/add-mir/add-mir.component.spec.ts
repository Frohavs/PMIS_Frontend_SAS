import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMirComponent } from './add-mir.component';

describe('AddMirComponent', () => {
  let component: AddMirComponent;
  let fixture: ComponentFixture<AddMirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMirComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
