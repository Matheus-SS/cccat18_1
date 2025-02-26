import IAccountDAO from "./accountDAO";

export default class GetAccount {
    constructor (readonly accountDAO: IAccountDAO) {}
    async execute(accountId: string) {
        const accountData = await this.accountDAO.getAccountById(accountId);
        return accountData;
    };
}


