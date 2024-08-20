import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePlanListComponent } from './resource-plan-list.component';

describe('ResourcePlanListComponent', () => {
  let component: ResourcePlanListComponent;
  let fixture: ComponentFixture<ResourcePlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcePlanListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourcePlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
