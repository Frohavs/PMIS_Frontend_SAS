import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageGateManagmentComponent } from './stage-gate-managment.component';

describe('StageGateManagmentComponent', () => {
  let component: StageGateManagmentComponent;
  let fixture: ComponentFixture<StageGateManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageGateManagmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StageGateManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
