import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HseFindingComponent } from './hse-finding.component';

describe('HseFindingComponent', () => {
  let component: HseFindingComponent;
  let fixture: ComponentFixture<HseFindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HseFindingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HseFindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
