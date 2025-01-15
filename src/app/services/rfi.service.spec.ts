import { TestBed } from '@angular/core/testing';

import { RfiService } from './rfi.service';

describe('RfiService', () => {
  let service: RfiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
