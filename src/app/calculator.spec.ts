import { Calculator } from './calculator';

describe('Test for Calculator', () => {
  it('#multiply should return a nine', () => {
    //Arrange
    const calculator = new Calculator();
    //Act
    const rta = calculator.multiply(3,3);
    //Assert
    expect(rta).toEqual(9);
  });
  it('#divide should return a two', () => {
    //Arrange
    const calculator = new Calculator();
    //Act
    const rta = calculator.divide(4,2);
    //Assert
    expect(rta).toEqual(2);
  });
  it('#divide should return null', () => {
    //Arrange
    const calculator = new Calculator();
    //Act
    const rta = calculator.divide(4,0);
    //Assert
    expect(rta).toBeNull();
  });
});