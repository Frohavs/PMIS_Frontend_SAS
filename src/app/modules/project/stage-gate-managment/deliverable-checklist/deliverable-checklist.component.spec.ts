import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverableChecklistComponent } from './deliverable-checklist.component';

describe('DeliverableChecklistComponent', () => {
  let component: DeliverableChecklistComponent;
  let fixture: ComponentFixture<DeliverableChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverableChecklistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliverableChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
