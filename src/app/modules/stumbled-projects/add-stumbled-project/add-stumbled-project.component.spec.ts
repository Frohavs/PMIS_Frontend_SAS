import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStumbledProjectComponent } from './add-stumbled-project.component';

describe('AddStumbledProjectComponent', () => {
  let component: AddStumbledProjectComponent;
  let fixture: ComponentFixture<AddStumbledProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStumbledProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddStumbledProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
