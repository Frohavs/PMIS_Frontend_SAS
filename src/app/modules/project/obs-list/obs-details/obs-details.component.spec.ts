import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsDetailsComponent } from './obs-details.component';

describe('ObsDetailsComponent', () => {
  let component: ObsDetailsComponent;
  let fixture: ComponentFixture<ObsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
