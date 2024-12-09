import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdministratorComponent } from './add-administrator.component';

describe('AddAdministratorComponent', () => {
  let component: AddAdministratorComponent;
  let fixture: ComponentFixture<AddAdministratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAdministratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
