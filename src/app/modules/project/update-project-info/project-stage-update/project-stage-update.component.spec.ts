import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageUpdateComponent } from './project-stage-update.component';

describe('ProjectStageUpdateComponent', () => {
  let component: ProjectStageUpdateComponent;
  let fixture: ComponentFixture<ProjectStageUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStageUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectStageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
