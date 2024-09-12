import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFloodComponent } from './add-flood.component';

describe('AddFloodComponent', () => {
  let component: AddFloodComponent;
  let fixture: ComponentFixture<AddFloodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFloodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFloodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
