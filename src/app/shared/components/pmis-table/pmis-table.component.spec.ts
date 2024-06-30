import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmisTableComponent } from './pmis-table.component';

describe('PmisTableComponent', () => {
  let component: PmisTableComponent;
  let fixture: ComponentFixture<PmisTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PmisTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PmisTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
