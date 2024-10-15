import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KickoffPrintComponent } from './kickoff-print.component';

describe('KickoffPrintComponent', () => {
  let component: KickoffPrintComponent;
  let fixture: ComponentFixture<KickoffPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KickoffPrintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KickoffPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
