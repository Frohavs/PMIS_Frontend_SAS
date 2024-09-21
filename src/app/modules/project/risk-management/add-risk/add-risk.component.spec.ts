import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiskComponent } from './add-risk.component';

describe('AddRiskComponent', () => {
  let component: AddRiskComponent;
  let fixture: ComponentFixture<AddRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRiskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
