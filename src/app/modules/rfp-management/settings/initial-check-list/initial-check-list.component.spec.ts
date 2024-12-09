import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialCheckListComponent } from './initial-check-list.component';

describe('InitialCheckListComponent', () => {
  let component: InitialCheckListComponent;
  let fixture: ComponentFixture<InitialCheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialCheckListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitialCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
