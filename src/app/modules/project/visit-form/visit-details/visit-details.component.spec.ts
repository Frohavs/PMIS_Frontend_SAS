import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitDetailsComponent } from './visit-details.component';

describe('VisitDetailsComponent', () => {
  let component: VisitDetailsComponent;
  let fixture: ComponentFixture<VisitDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
