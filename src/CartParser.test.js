import CartParser from './CartParser';
import mockData from '../samples/cart.json';

let parser;

beforeEach(() => {
  parser = new CartParser();
});

describe('CartParser - unit tests', () => {
  // Add your unit tests here.
  describe('parse', () => {
    it('should return an object with items and total price', () => {
      const result = parser.parse('./samples/cart.csv');
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
    });

    it('should throw an Error, if the invalid file was passed', () => {
      expect(() => parser.parse('./samples/cart.json')).toThrow();
    });
  });

  describe('readFile', () => {
    it('should return file data', () => {
      const fileData = parser.readFile('./samples/cart.csv');
      expect(typeof fileData).toBe('string');
    });
    it('should throw an Error, when path is empty', () => {
      expect(() => parser.parse('')).toThrow();
    });

    it('should throw an Error, when path is incorrect', () => {
      expect(() => parser.parse('random/path/file.csv')).toThrow();
    });
  });

  describe('validate', () => {
    it('should return an empty array, if the content is valid', () => {
      const contents = parser.readFile('./samples/cart.csv');
      const errors = parser.validate(contents);
      expect(errors.length).toBe(0);
    });
    it('should throw an Error, if the content is empty', () => {
      expect(() => parser.validate('')).toThrow();
    });

    it('should throw an Error, if the content is invalid', () => {
      const errors = parser.validate('some random content');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('calcTotal', () => {
    it('should calculate total price of cart', () => {
      const total = parser.calcTotal(mockData.items);
      expect(total).toBeCloseTo(mockData.total);
    });

    it('should return 0, if there are no items', () => {
      const total = parser.calcTotal([]);
      expect(total).toBe(0);
    });
  });

  describe('parseLine', () => {
    it('should return object, based on csv line', () => {
      const line = 'Mollis consequat,9.00,2';
      const parsedLine = parser.parseLine(line);
      expect(parsedLine).toEqual({
        name: 'Mollis consequat',
        price: 9.0,
        quantity: 2,
        id: expect.any(String),
      });
    });
  });
});

describe('CartParser - integration test', () => {
  describe('validate', () => {
    it('should return error for incorrect header, types and num of columns', () => {
      const contents = parser.readFile('./samples/brokenCart.csv');
      const errors = parser.validate(contents);
      expect(errors.length).toBe(4);
    });
  });
});
