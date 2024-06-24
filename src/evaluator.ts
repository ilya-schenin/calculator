type OperatorFunction = (a: number, b: number) => number;

interface Operator {
  precedence: number;
  associativity: 'left' | 'right';
  fn: OperatorFunction;
}

class BasicOperator implements Operator {
  constructor(
    public precedence: number,
    public associativity: 'left' | 'right',
    public fn: OperatorFunction
  ) {}
}

class OperatorFactory {
  private operators: { [key: string]: Operator } = {};

  registerOperator(symbol: string, operator: Operator) {
    this.operators[symbol] = operator;
  }

  getOperator(symbol: string): Operator | undefined {
    return this.operators[symbol];
  }

  isOperator(symbol: string): boolean {
    return symbol in this.operators;
  }
}

export const operatorFactory = new OperatorFactory();
operatorFactory.registerOperator('+', new BasicOperator(1, 'left', (a, b) => a + b));
operatorFactory.registerOperator('-', new BasicOperator(1, 'left', (a, b) => a - b));
operatorFactory.registerOperator('*', new BasicOperator(2, 'left', (a, b) => a * b));
operatorFactory.registerOperator('/', new BasicOperator(2, 'left', (a, b) => a / b));

export class Evaluator {
  private toPostfix(tokens: string[]): string[] {
    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    for (const token of tokens) {
      if (!isNaN(parseFloat(token))) {
        outputQueue.push(token);
      } else if (operatorFactory.isOperator(token)) {
        const operator = operatorFactory.getOperator(token)!;
        while (
          operatorStack.length &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          ((operator.associativity === 'left' &&
            operator.precedence <= operatorFactory.getOperator(operatorStack[operatorStack.length - 1])!.precedence) ||
            (operator.associativity === 'right' &&
              operator.precedence < operatorFactory.getOperator(operatorStack[operatorStack.length - 1])!.precedence))
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.pop();
      }
    }

    while (operatorStack.length) {
      outputQueue.push(operatorStack.pop()!);
    }

    return outputQueue;
  }

  evaluate(tokens: string[]): number {
    const postfixTokens = this.toPostfix(tokens);
    const stack: number[] = [];

    for (const token of postfixTokens) {
      if (!isNaN(parseFloat(token))) {
        stack.push(parseFloat(token));
      } else if (operatorFactory.isOperator(token)) {
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(operatorFactory.getOperator(token)!.fn(a, b));
      }
    }

    return stack[0];
  }
}