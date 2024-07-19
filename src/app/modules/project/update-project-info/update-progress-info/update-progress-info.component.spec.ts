import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProgressInfoComponent } from './update-progress-info.component';

describe('UpdateProgressInfoComponent', () => {
  let component: UpdateProgressInfoComponent;
  let fixture: ComponentFixture<UpdateProgressInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProgressInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateProgressInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
