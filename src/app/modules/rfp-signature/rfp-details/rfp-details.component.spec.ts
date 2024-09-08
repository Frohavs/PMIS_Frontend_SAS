import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpDetailsComponent } from './rfp-details.component';

describe('RfpDetailsComponent', () => {
  let component: RfpDetailsComponent;
  let fixture: ComponentFixture<RfpDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfpDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
