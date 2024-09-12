import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSiteLocationComponent } from './project-site-location.component';

describe('ProjectSiteLocationComponent', () => {
  let component: ProjectSiteLocationComponent;
  let fixture: ComponentFixture<ProjectSiteLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSiteLocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectSiteLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
