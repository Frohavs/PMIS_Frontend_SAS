import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectStaffComponent } from './update-project-staff.component';

describe('UpdateProjectStaffComponent', () => {
  let component: UpdateProjectStaffComponent;
  let fixture: ComponentFixture<UpdateProjectStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProjectStaffComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateProjectStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
