import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpPositionDetailsComponent } from './rfp-position-details.component';

describe('RfpPositionDetailsComponent', () => {
  let component: RfpPositionDetailsComponent;
  let fixture: ComponentFixture<RfpPositionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfpPositionDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfpPositionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
