import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObsComponent } from './add-obs.component';

describe('AddObsComponent', () => {
  let component: AddObsComponent;
  let fixture: ComponentFixture<AddObsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddObsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddObsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
