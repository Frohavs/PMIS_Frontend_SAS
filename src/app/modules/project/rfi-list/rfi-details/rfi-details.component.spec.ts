import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfiDetailsComponent } from './rfi-details.component';

describe('RfiDetailsComponent', () => {
  let component: RfiDetailsComponent;
  let fixture: ComponentFixture<RfiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfiDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
