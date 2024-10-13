import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCommiteeComponent } from './create-commitee.component';

describe('CreateCommiteeComponent', () => {
  let component: CreateCommiteeComponent;
  let fixture: ComponentFixture<CreateCommiteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCommiteeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCommiteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
