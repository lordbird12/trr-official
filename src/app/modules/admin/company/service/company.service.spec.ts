import { TestBed } from '@angular/core/testing';

import { JournalService } from './company.service';

describe('NewsService', () => {
  let service: JournalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});