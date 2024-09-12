import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloodDetailsComponent } from './flood-details.component';

describe('FloodDetailsComponent', () => {
  let component: FloodDetailsComponent;
  let fixture: ComponentFixture<FloodDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloodDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FloodDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
