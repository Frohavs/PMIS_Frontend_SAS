import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteStudiesDesignsDashboardComponent } from './site-studies-designs-dashboard.component';

describe('SiteStudiesDesignsDashboardComponent', () => {
  let component: SiteStudiesDesignsDashboardComponent;
  let fixture: ComponentFixture<SiteStudiesDesignsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteStudiesDesignsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteStudiesDesignsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
