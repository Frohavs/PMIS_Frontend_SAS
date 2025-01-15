import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRfiComponent } from './add-rfi.component';

describe('AddRfiComponent', () => {
  let component: AddRfiComponent;
  let fixture: ComponentFixture<AddRfiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRfiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRfiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
