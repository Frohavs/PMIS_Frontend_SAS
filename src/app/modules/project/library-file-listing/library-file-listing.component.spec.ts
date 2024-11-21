import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryFileListingComponent } from './library-file-listing.component';

describe('LibraryFileListingComponent', () => {
  let component: LibraryFileListingComponent;
  let fixture: ComponentFixture<LibraryFileListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryFileListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibraryFileListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
