import { errors } from "./utils";

export class CarPlate {
    private value: string;
    constructor(value: string) {
        if (!Boolean(value.match(/[A-Z]{3}[0-9]{4}/)?.length)) {
            throw new Error(errors.INVALID_CAR_PLATE);
        }
        this.value = value
    }

    getValue() {
        return this.value;
    }
}