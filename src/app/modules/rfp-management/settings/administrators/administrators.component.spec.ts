import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorsComponent } from './administrators.component';

describe('AdministratorsComponent', () => {
  let component: AdministratorsComponent;
  let fixture: ComponentFixture<AdministratorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministratorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
