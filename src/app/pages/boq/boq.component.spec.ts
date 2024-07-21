import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoqComponent } from './boq.component';

describe('BoqComponent', () => {
  let component: BoqComponent;
  let fixture: ComponentFixture<BoqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
