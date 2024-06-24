import { Parser, OperatorTokenizerFactory, NumberTokenizerFactory } from "./parser";


describe('Parser', () => {
    let parser: Parser;
  
    beforeEach(() => {
      parser = new Parser([new NumberTokenizerFactory(), new OperatorTokenizerFactory()]);
    });
  
    test('parses a valid expression correctly', () => {
        const expression = '3 + 5 * (2 - 8)';
        const tokens = parser.parse(expression);
        expect(tokens).toEqual(['3', '+', '5', '*', '(', '2', '-', '8', ')']);
    });

    test('throws an error for an invalid expression', () => {
        const expression = '3 + 5 * (2 - 8) &';
        expect(() => {
            parser.parse(expression);
        }).toThrow('Invalid symbols was defined');
    });
})