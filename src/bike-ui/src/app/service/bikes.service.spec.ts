import { TestBed } from '@angular/core/testing';

import { BikesService } from './bikes.service';

describe('BikesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BikesService = TestBed.get(BikesService);
    expect(service).toBeTruthy();
  });
});
