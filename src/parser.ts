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

export default class Parser {
    private tokenizers: Tokenizer[] = [];

    constructor() {
        this.tokenizers.push(new NumberTokenizer());
        this.tokenizers.push(new OperatorTokenizer());
    }

    parse(expression: string): string[] {
        const tokens: string[] = [];
        let currentTokenizer: Tokenizer | null = null;

        for (const char of expression) {
            if (/\s/.test(char)) continue;

            if (currentTokenizer && currentTokenizer.matches(char)) {
                currentTokenizer.append(char);
            } else {
                if (currentTokenizer) {
                    tokens.push(currentTokenizer.getToken());
                    currentTokenizer.reset();
                }

                currentTokenizer = this.tokenizers.find(
                    tokenizer => tokenizer.matches(char)
                ) || null;
                
                if (currentTokenizer) {
                    currentTokenizer.append(char);
                }
            }
        }

        if (currentTokenizer && currentTokenizer.getToken()) {
            tokens.push(currentTokenizer.getToken());
        }

        return tokens;
    }
}
