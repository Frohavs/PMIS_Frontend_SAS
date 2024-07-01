import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmisAccordionComponent } from './pmis-accordion.component';

describe('PmisAccordionComponent', () => {
  let component: PmisAccordionComponent;
  let fixture: ComponentFixture<PmisAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmisAccordionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PmisAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
