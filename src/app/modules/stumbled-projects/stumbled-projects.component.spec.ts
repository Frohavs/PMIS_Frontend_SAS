import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StumbledProjectsComponent } from './stumbled-projects.component';

describe('StumbledProjectsComponent', () => {
  let component: StumbledProjectsComponent;
  let fixture: ComponentFixture<StumbledProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StumbledProjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StumbledProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
