import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeDataComponent } from './exchange-data.component';

describe('ExchangeDataComponent', () => {
  let component: ExchangeDataComponent;
  let fixture: ComponentFixture<ExchangeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExchangeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
