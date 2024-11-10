import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectFilesComponent } from './add-project-files.component';

describe('AddProjectFilesComponent', () => {
  let component: AddProjectFilesComponent;
  let fixture: ComponentFixture<AddProjectFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProjectFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProjectFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
