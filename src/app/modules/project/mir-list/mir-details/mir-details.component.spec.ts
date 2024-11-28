import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MirDetailsComponent } from './mir-details.component';

describe('MirDetailsComponent', () => {
  let component: MirDetailsComponent;
  let fixture: ComponentFixture<MirDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MirDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MirDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
