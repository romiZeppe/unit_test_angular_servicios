import { MasterService } from './master.service';
import { ValueFakeService } from './value-fake.service';
import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing';

describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>
  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue'])
    TestBed.configureTestingModule({
      providers: [MasterService, 
        {provide: ValueService, useValue: spy}]
    })
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should be create', () => {
    expect(masterService).toBeTruthy();
  });

  /*it('should be return my value from the real service', () => {
    let valueService = new ValueService();
    let masterService = new MasterService(valueService);
    expect(masterService.getValue()).toBe('my value');
  });
  //esta falseando con un servicio falso donde se llama la funcion
  it('should return other value from the fake service', () => {
    let valueFakeService = new ValueFakeService();
    let masterService = new MasterService(valueFakeService as unknown as ValueService);
    expect(masterService.getValue()).toBe('fake value');
  });
  //esta falseando la funcion del servicio de value
  it('should return other value from the fake object', () => {
    let fake = {getValue: () => 'fake from object'}
    let masterService = new MasterService(fake as ValueService);
    expect(masterService.getValue()).toBe('fake from object');
  });*/
  it('should return other value from valueService', () => {
    valueServiceSpy.getValue.and.returnValue('fake value')
    expect(masterService.getValue()).toBe('fake value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(2);
  });
});
