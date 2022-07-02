import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

xdescribe('MapsService', () => {
  let service: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapsService]
    });
    service = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('test for getcurrentposition', () => {
    it('should save the center', (doneFn) => {
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((sucess) => {
        const mockGeo = {
          coords: {
            accuracy: 0,
            altitude: 0,
            altitudeAccuracy:0,
            heading: 0,
            latitude: 1000,
            longitude: 2000,
            speed: 0
          },
          timestamp: 0
        }
        sucess(mockGeo);
      });
      service.getCurrentPosition();
      expect(service.center.lat).toEqual(1000);
      expect(service.center.lng).toEqual(2000);
    });
  });
});
