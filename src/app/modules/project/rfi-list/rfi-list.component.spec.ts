import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfiListComponent } from './rfi-list.component';

describe('RfiListComponent', () => {
  let component: RfiListComponent;
  let fixture: ComponentFixture<RfiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfiListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RfiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
