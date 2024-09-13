import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsListComponent } from './obs-list.component';

describe('ObsListComponent', () => {
  let component: ObsListComponent;
  let fixture: ComponentFixture<ObsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
