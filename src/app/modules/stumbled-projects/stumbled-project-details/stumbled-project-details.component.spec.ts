import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StumbledProjectDetailsComponent } from './stumbled-project-details.component';

describe('StumbledProjectDetailsComponent', () => {
  let component: StumbledProjectDetailsComponent;
  let fixture: ComponentFixture<StumbledProjectDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StumbledProjectDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StumbledProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
