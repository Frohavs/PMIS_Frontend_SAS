import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCheckListComponent } from './owner-check-list.component';

describe('OwnerCheckListComponent', () => {
  let component: OwnerCheckListComponent;
  let fixture: ComponentFixture<OwnerCheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerCheckListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
