import { firstValueFrom } from 'rxjs';
import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService]
    })
    service = TestBed.inject(ValueService);
  });

  it('should be create', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for getValue', () => {
    it('should return my value', () => {
      expect(service.getValue()).toBe('my value');
      service.setValue('change');
      expect(service.getValue()).toBe('change');
    });
  });
  describe('Test for getPromiseValue', () => {
    it('should return promise value whit then', (doneFn) => {
      service.getPromiseValue()
      .then((value) => {
        expect(value).toBe('promise value');
        doneFn();
      })
    });
    it('should return promise value whit async', async () => {
      const rta = await service.getPromiseValue();
      expect(rta).toBe('promise value');
    });
  });
  describe('Test for getObservableValue', () => {
    it('should return "observable value"', (doneFn) => {
      service.getObservableValue().subscribe((value) => {
        expect(value).toBe('observable value');
        doneFn();
      });
    })
  })

  describe('Test for getObservableValue Sync', () => {
    it('should return "observable value"', async () => {
      const value = await firstValueFrom(service.getObservableValue());
      expect(value).toBe('observable value');
    })
  })
});
