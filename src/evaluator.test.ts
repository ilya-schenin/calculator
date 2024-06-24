import {Parser, NumberTokenizerFactory, OperatorTokenizerFactory} from "./parser";
import { Evaluator } from "./evaluator";


describe('Evaluator', () => {
    let evaluator: Evaluator;
    let parser: Parser;
  
    beforeEach(() => {
      evaluator = new Evaluator();
      parser = new Parser([new NumberTokenizerFactory(), new OperatorTokenizerFactory()]);
    });
  
    test('should evaluate simple addition', () => {
      const expression = '3 + 4';
      const tokens = parser.parse(expression);
      const result = evaluator.evaluate(tokens);
      expect(result).toBe(7);
    });
  
    test('should evaluate simple subtraction', () => {
      const expression = '10 - 5';
      const tokens = parser.parse(expression);
      const result = evaluator.evaluate(tokens);
      expect(result).toBe(5);
    });
  
    test('should evaluate simple multiplication', () => {
      const expression = '2 * 3';
      const tokens = parser.parse(expression);
      const result = evaluator.evaluate(tokens);
      expect(result).toBe(6);
    });
  
    test('should evaluate simple division', () => {
      const expression = '8 / 2';
      const tokens = parser.parse(expression);
      const result = evaluator.evaluate(tokens);
      expect(result).toBe(4);
    });
  
    test('should evaluate complex expression with mixed operators', () => {
      const expression = '3 + 4 * 2 / (1 - 5)';
      const tokens = parser.parse(expression);
      const result = evaluator.evaluate(tokens);
      expect(result).toBe(1);
    });
  
    test('should handle negative numbers', () => {
      const expression = '-3 + 4';
      const tokens = parser.parse(expression);
      const result = evaluator.evaluate(tokens);
      expect(result).toBe(1);
    });
  
    test('should handle multiple-digit numbers', () => {
      const expression = '10 + 20';
      const tokens = parser.parse(expression);
      const result = evaluator.evaluate(tokens);
      expect(result).toBe(30);
    });
  });