import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HseComponent } from './hse.component';

describe('HseComponent', () => {
  let component: HseComponent;
  let fixture: ComponentFixture<HseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
