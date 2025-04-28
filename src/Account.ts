import { CarPlate } from "./CarPlate";
import { Cpf } from "./Cpf";
import { Email } from "./Email";
import { Name } from "./Name";
import { Password } from "./Password";
import { UUID } from "./UUID";

export class Account {
    private accountId: UUID;
    private name: Name;
    private email: Email;
    private carPlate?: CarPlate;
    private cpf: Cpf;
    private password: Password

    constructor(
        accountId: string,
        name: string,
        email: string,
        carPlate: string,
        cpf: string,
        password: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
    ){
        this.accountId = new UUID(accountId);
        this.name = new Name(name);
        this.email = new Email(email);
        if (isDriver) this.carPlate = new CarPlate(carPlate);
        this.cpf = new Cpf(cpf);
        this.password = new Password(password)
    }

    static create(
        name: string,
        email: string,
        carPlate: string,
        cpf: string,
        password: string,
        isPassenger: boolean,
        isDriver: boolean,
    ) {
        const accountId =  UUID.create();
        return new Account(
            accountId.getValue(),
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
        return (this.isDriver) ? this.carPlate?.getValue() : "";
    }
    getPassword() {
        return this.password.getValue();
    }
    getName() {
        return this.name.getValue();
    }
    getAccountId() {
        return this.accountId.getValue();
    }

}
