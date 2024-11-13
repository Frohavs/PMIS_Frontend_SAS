import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HseFindingDetailsComponent } from './hse-finding-details.component';

describe('HseFindingDetailsComponent', () => {
  let component: HseFindingDetailsComponent;
  let fixture: ComponentFixture<HseFindingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HseFindingDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HseFindingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
