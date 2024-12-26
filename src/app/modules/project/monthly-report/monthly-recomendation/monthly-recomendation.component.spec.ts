import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyRecomendationComponent } from './monthly-recomendation.component';

describe('MonthlyRecomendationComponent', () => {
  let component: MonthlyRecomendationComponent;
  let fixture: ComponentFixture<MonthlyRecomendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyRecomendationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlyRecomendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
