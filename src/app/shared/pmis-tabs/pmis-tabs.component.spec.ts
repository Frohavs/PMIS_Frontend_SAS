import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmisTabsComponent } from './pmis-tabs.component';

describe('PmisTabsComponent', () => {
  let component: PmisTabsComponent;
  let fixture: ComponentFixture<PmisTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmisTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PmisTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
