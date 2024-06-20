interface Tokenizer {
    matches(char: string): boolean;
    append(char: string): void;
    getToken(): string;
    reset(): void;
}

class NumberTokenizer implements Tokenizer {
    private token = '';

    matches(char: string): boolean {
        return /[0-9.]/.test(char);
    }

    append(char: string): void {
        this.token += char;
    }

    getToken(): string {
        return this.token;
    }

    reset(): void {
        this.token = '';
    }
}

class OperatorTokenizer implements Tokenizer {
    private token = '';

    matches(char: string): boolean {
        return /[+\-*/()]/.test(char);
    }

    append(char: string): void {
        this.token = char;
    }

    getToken(): string {
        return this.token;
    }

    reset(): void {
        this.token = '';
    }
}

interface TokenizerFactory {
    createTokenizer(): Tokenizer;
}

class NumberTokenizerFactory implements TokenizerFactory {
    createTokenizer(): Tokenizer {
        return new NumberTokenizer();
    }
}

class OperatorTokenizerFactory implements TokenizerFactory {
    createTokenizer(): Tokenizer {
        return new OperatorTokenizer();
    }
}


export default class Parser {
    private tokenizers: TokenizerFactory[] = [];

    constructor() {
        this.tokenizers.push(new NumberTokenizerFactory());
        this.tokenizers.push(new OperatorTokenizerFactory());
    }

    parse(expression: string): string[] {
        const tokens: string[] = [];
        let currentTokenizer: Tokenizer | null = null;
        let index = 0;
        for (const char of expression) {
            if (/\s/.test(char)) continue;
            if (index === 0 && char === '-') {
                currentTokenizer = new NumberTokenizer();
                currentTokenizer.append(char);
                continue;
            };
            if (currentTokenizer && currentTokenizer.matches(char)) {
                if (currentTokenizer instanceof OperatorTokenizer 
                && currentTokenizer.getToken().length === 1) {
                    tokens.push(currentTokenizer.getToken());
                    if (/[[+\-*/]/.test(char)) {
                        currentTokenizer = new NumberTokenizer();
                        currentTokenizer.append(char);
                        continue;
                    }
                }
                currentTokenizer.append(char);                
            } else {
                if (currentTokenizer) {
                    tokens.push(currentTokenizer.getToken());
                    currentTokenizer.reset();
                }

                currentTokenizer = null;
                for (const factory of this.tokenizers) {
                    const tokenizer = factory.createTokenizer();
                    if (tokenizer.matches(char)) {
                        currentTokenizer = tokenizer;
                        break;
                    }
                }
                
                if (!currentTokenizer) {
                    throw new Error(`Invalid character encountered: ${char}`);
                }

                currentTokenizer.append(char);
            }
            index += 1;
        }

        if (currentTokenizer && currentTokenizer.getToken()) {
            tokens.push(currentTokenizer.getToken());
        }        
        return tokens;
    }
}
