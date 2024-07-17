import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectInfoComponent } from './update-project-info.component';

describe('UpdateProjectInfoComponent', () => {
  let component: UpdateProjectInfoComponent;
  let fixture: ComponentFixture<UpdateProjectInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProjectInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateProjectInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
