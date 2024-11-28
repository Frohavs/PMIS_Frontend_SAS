import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MirListComponent } from './mir-list.component';

describe('MirListComponent', () => {
  let component: MirListComponent;
  let fixture: ComponentFixture<MirListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MirListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MirListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
