import IAccountRepository from "./accountRepository";

export default class GetAccount {
    constructor (readonly accountRepository: IAccountRepository) {}
    async execute(accountId: string) {
        const account = await this.accountRepository.getAccountById(accountId);
        //DTO - DATA TRANSFER OBJECT
        return {
            accountId: account?.getAccountId(),
            name: account?.getName(),
            email: account?.getEmail(),
            password: account?.getPassword(),
            cpf: account?.getCpf(),
            carPlate: account?.getCarPlate(),
            isPassenger: account?.isPassenger,
            isDriver: account?.isDriver
        };
    };
}


