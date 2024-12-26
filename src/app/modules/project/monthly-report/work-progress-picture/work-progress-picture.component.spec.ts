import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkProgressPictureComponent } from './work-progress-picture.component';

describe('WorkProgressPictureComponent', () => {
  let component: WorkProgressPictureComponent;
  let fixture: ComponentFixture<WorkProgressPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkProgressPictureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkProgressPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
