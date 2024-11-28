import { TestBed } from '@angular/core/testing';

import { PdpaService } from './condition.service';

describe('PdpaService', () => {
  let service: PdpaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdpaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
