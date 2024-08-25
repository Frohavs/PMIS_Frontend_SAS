import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubContractorComponent } from './add-sub-contractor.component';

describe('AddSubContractorComponent', () => {
  let component: AddSubContractorComponent;
  let fixture: ComponentFixture<AddSubContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubContractorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSubContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
