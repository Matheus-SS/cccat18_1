import { errors } from "./utils";

export class Name {
    private value: string;
    constructor(value: string) {
        if (!Boolean(value.match(/[a-zA-Z] [a-zA-Z]+/)?.length)) {
            throw new Error(errors.INVALID_NAME);
        }
        this.value = value
    }

    getValue() {
        return this.value;
    }
}