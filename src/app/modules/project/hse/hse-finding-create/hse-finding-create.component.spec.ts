import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HseFindingCreateComponent } from './hse-finding-create.component';

describe('HseFindingCreateComponent', () => {
  let component: HseFindingCreateComponent;
  let fixture: ComponentFixture<HseFindingCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HseFindingCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HseFindingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
