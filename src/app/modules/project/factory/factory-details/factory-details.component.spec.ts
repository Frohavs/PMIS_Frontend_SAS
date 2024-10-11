import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryDetailsComponent } from './factory-details.component';

describe('FactoryDetailsComponent', () => {
  let component: FactoryDetailsComponent;
  let fixture: ComponentFixture<FactoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactoryDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
