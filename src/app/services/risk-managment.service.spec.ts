import { TestBed } from '@angular/core/testing';

import { RiskManagementService } from './risk-managment.service';

describe('RiskManagmentService', () => {
  let service: RiskManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
