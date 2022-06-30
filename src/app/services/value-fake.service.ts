
export class ValueFakeService {
  constructor() { 

  }

  getValue() {
    return 'fake value';
  }

  setValue(value: string) {

  }

  getPromiseValue() {
    return Promise.resolve('fake promise value')
  }

}
