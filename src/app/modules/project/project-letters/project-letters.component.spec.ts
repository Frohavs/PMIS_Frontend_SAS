import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLettersComponent } from './project-letters.component';

describe('ProjectLettersComponent', () => {
  let component: ProjectLettersComponent;
  let fixture: ComponentFixture<ProjectLettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectLettersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
