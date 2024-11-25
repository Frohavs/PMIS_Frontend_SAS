import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStumbledComponent } from './view-stumbled.component';

describe('ViewStumbledComponent', () => {
  let component: ViewStumbledComponent;
  let fixture: ComponentFixture<ViewStumbledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStumbledComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewStumbledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
