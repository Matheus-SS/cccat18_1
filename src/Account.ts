import { CarPlate } from "./CarPlate";
import { Cpf } from "./Cpf";
import { Email } from "./Email";
import { Name } from "./Name";
import { Password } from "./Password";

export class Account {
    private name: Name;
    private email: Email;
    private carPlate: CarPlate;
    private cpf: Cpf;
    private password: Password

    constructor(
        readonly accountId: string,
        name: string,
        email: string,
        carPlate: string,
        cpf: string,
        password: string,
        readonly isPassenger: string,
        readonly isDriver: string,
    ){
        this.name = new Name(name);
        this.email = new Email(email);
        this.carPlate = new CarPlate(carPlate);
        this.cpf = new Cpf(cpf);
        this.password = new Password(password)
    }

    static create(
        name: string,
        email: string,
        carPlate: string,
        cpf: string,
        password: string,
        isPassenger: string,
        isDriver: string,
    ) {
        const accountId = crypto.randomUUID();
        return new Account(
            accountId,
            name,
            email,
            carPlate,
            cpf,
            password,
            isPassenger,
            isDriver
        )
    }

    getEmail() {
        return this.email.getValue();
    }
    getCpf() {
        return this.cpf.getValue();
    }
    getCarPlate() {
        return this.carPlate.getValue();
    }
    getPassword() {
        return this.password.getValue();
    }
    getName() {
        return this.name.getValue();
    }
}
