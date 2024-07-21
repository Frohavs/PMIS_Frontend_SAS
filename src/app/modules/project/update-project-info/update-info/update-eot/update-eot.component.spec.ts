import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEotComponent } from './update-eot.component';

describe('UpdateEotComponent', () => {
  let component: UpdateEotComponent;
  let fixture: ComponentFixture<UpdateEotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateEotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
