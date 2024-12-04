import { TestBed } from '@angular/core/testing';

import { ProjectSitesService } from './project-sites.service';

describe('ProjectSitesService', () => {
  let service: ProjectSitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
