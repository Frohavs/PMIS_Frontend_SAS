import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDeliverableChecklistComponent } from './upload-deliverable-checklist.component';

describe('UploadDeliverableChecklistComponent', () => {
  let component: UploadDeliverableChecklistComponent;
  let fixture: ComponentFixture<UploadDeliverableChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDeliverableChecklistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadDeliverableChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
