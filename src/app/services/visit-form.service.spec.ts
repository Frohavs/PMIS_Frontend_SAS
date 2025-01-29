import { TestBed } from '@angular/core/testing';

import { VisitFormService } from './visit-form.service';

describe('VisitFormService', () => {
  let service: VisitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
