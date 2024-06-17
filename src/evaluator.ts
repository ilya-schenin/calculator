type OperatorFunction = (a: number, b: number) => number;

interface Operator {
  precedence: number;
  associativity: 'left' | 'right';
  fn: OperatorFunction;
}

const operators: { [key: string]: Operator } = {
  '+': { precedence: 1, associativity: 'left', fn: (a, b) => a + b },
  '-': { precedence: 1, associativity: 'left', fn: (a, b) => a - b },
  '*': { precedence: 2, associativity: 'left', fn: (a, b) => a * b },
  '/': { precedence: 2, associativity: 'left', fn: (a, b) => a / b },
};

export class Evaluator {
  private toPostfix(tokens: string[]): string[] {
    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    for (const token of tokens) {
      if (!isNaN(parseFloat(token))) {
        outputQueue.push(token);
      } else if (token in operators) {
        while (
          operatorStack.length &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          ((operators[token].associativity === 'left' &&
            operators[token].precedence <= operators[operatorStack[operatorStack.length - 1]].precedence) ||
            (operators[token].associativity === 'right' &&
              operators[token].precedence < operators[operatorStack[operatorStack.length - 1]].precedence))
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
      } else if (token in operators) {
        const b = stack.pop()!;
        const a = stack.pop()!;
        stack.push(operators[token].fn(a, b));
      }
    }

    return stack[0];
  }
}