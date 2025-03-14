import { errors } from "./utils";

export class Email {
    private value: string;
    constructor(value: string) {
        if (!Boolean(value.match(/^(.+)@(.+)$/)?.length)) {
            throw new Error(errors.INVALID_EMAIL);
        }
        this.value = value
    }

    getValue() {
        return this.value;
    }
}