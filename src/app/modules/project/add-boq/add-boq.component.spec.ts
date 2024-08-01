import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoqComponent } from './add-boq.component';

describe('AddBoqComponent', () => {
  let component: AddBoqComponent;
  let fixture: ComponentFixture<AddBoqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBoqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
