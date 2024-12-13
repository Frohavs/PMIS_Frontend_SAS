import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpPositionComponent } from './rfp-position.component';

describe('RfpPositionComponent', () => {
  let component: RfpPositionComponent;
  let fixture: ComponentFixture<RfpPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfpPositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfpPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
