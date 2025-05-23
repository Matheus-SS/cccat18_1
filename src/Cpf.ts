import { errors } from "./utils";

export class Cpf {
    private value: string;
    private CPF_VALID_LENGTH = 11;
    private FIRST_DIGIT_FACTOR = 10;
    private SECOND_DIGIT_FACTOR = 11;

    constructor(value: string) {
        if (!this.validateCpf(value)) {
            throw new Error(errors.INVALID_CPF);
        }
        this.value = value
    }
 
    getValue() {
        return this.value;
    }

   validateCpf (cpf: string) {
	cpf = cpf.replace(/\D/g, "");
	if (cpf.length !== this.CPF_VALID_LENGTH) return false;
	if (this.allDigitsTheSame(cpf)) return false;
	const digit1 = this.calculateDigit(cpf, this.FIRST_DIGIT_FACTOR);
	const digit2 = this.calculateDigit(cpf, this.SECOND_DIGIT_FACTOR);
	return `${digit1}${digit2}` === this.extractDigit(cpf);
}

    allDigitsTheSame (cpf: string) {
        const [firstDigit] = cpf;
        return [...cpf].every(digit => digit === firstDigit);
    }

    calculateDigit (cpf: string, factor: number) {
        let total = 0;
        for (const digit of cpf) {
            if (factor > 1) total += parseInt(digit) * factor--;
        }
        const remainder = total % 11;
        return (remainder < 2) ? 0 : 11 - remainder;
    }

    extractDigit (cpf: string) {
        return cpf.slice(9);
    }

}