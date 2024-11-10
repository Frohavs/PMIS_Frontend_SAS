import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFilesTreeComponent } from './project-files-tree.component';

describe('ProjectFilesTreeComponent', () => {
  let component: ProjectFilesTreeComponent;
  let fixture: ComponentFixture<ProjectFilesTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectFilesTreeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectFilesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
