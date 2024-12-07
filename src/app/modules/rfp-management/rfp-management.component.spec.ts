import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpManagementComponent } from './rfp-management.component';

describe('RfpManagementComponent', () => {
  let component: RfpManagementComponent;
  let fixture: ComponentFixture<RfpManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfpManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfpManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
