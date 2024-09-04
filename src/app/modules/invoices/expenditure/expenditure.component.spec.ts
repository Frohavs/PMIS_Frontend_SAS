import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenditureComponent } from './expenditure.component';

describe('ExpenditureComponent', () => {
  let component: ExpenditureComponent;
  let fixture: ComponentFixture<ExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenditureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
