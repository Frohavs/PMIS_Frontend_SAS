import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsPageComponent } from './questions-page.component';

describe('QuestionsPageComponent', () => {
  let component: QuestionsPageComponent;
  let fixture: ComponentFixture<QuestionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
