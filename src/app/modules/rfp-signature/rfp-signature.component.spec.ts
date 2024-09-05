import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpSignatureComponent } from './rfp-signature.component';

describe('RfpSignatureComponent', () => {
  let component: RfpSignatureComponent;
  let fixture: ComponentFixture<RfpSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfpSignatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfpSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
