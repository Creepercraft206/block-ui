import { TestBed } from '@angular/core/testing';

import { BlockuiService } from './blockui.service';

describe('BlockuiService', () => {
  let service: BlockuiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockuiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
