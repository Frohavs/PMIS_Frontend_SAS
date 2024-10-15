import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageGateManagementComponent } from './stage-gate-management.component';

describe('StageGateManagementComponent', () => {
  let component: StageGateManagementComponent;
  let fixture: ComponentFixture<StageGateManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageGateManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StageGateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
