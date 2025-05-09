import pgp from "pg-promise";
import { Account } from "./Account";

export const connection = pgp()({
    connectionString: "postgres://postgres:123456@localhost:5432/app",
    max: 10
});
//PORT
export default interface IAccountRepository {
    getAccountByEmail(email: string): Promise<Account| undefined>;
    getAccountById(accountId: string): Promise<Account|undefined>;
    saveAccount(account: any): Promise<any>;
}
//ADAPTER
export class AccountRepositoryDatabase implements IAccountRepository {
   async getAccountByEmail(email: string) {
        const [acc] = await connection.query("select * from ccca.account where email = $1", [email]);
        if (!acc) return
        return new Account(acc.account_id, acc.name, acc.email,acc.car_plate,acc.cpf,acc.password,acc.is_passenger, acc.is_driver)
    };
    
    async getAccountById(accountId: string) {
        const [acc] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
        if (!acc) return;
        return new Account(acc.account_id, acc.name, acc.email,acc.car_plate,acc.cpf,acc.password,acc.is_passenger, acc.is_driver)
    };
    
    async saveAccount(account: Account) {
        await connection.query(`
            insert into ccca.account (
                account_id, 
                name, 
                email, 
                cpf, 
                car_plate, 
                is_passenger, 
                is_driver, 
                password
            ) values ($1, $2, $3, $4, $5, $6, $7, $8)`, [
                account.getAccountId(), account.getName(), account.getEmail(), account.getCpf(), 
                account.getCarPlate(), !!account.isPassenger, !!account.isDriver, 
                account.getPassword()
        ]);
    }
}
//ADAPTER
export class AccountRepositoryMemory implements IAccountRepository {
    account: Account[]

    constructor () {
        this.account = []
    }

    async getAccountByEmail(email: string): Promise<any> {
        const account =  this.account.find(account => account.getEmail() === email);
        if (!account) return;
        const map =  {
            ...account,
            is_driver: account.isDriver,
            is_passenger: account.isPassenger
        }
        const carPlate = account.getCarPlate()!;
        return new Account(
        account.getAccountId(), account.getName(), account.getEmail(), carPlate,account.getCpf(), 
        account.getPassword(), !!account.isPassenger, !!account.isDriver, 
        )
    }
    async getAccountById(accountId: string): Promise<any> {
        const account =  this.account.find(account => account.getAccountId() === accountId);
        if (!account) return;
        const map =  {
            ...account,
            is_driver: account.isDriver,
            is_passenger: account.isPassenger
        }
        const carPlate = account.getCarPlate()!;
        return new Account(
        account.getAccountId(), account.getName(), account.getEmail(), carPlate,account.getCpf(), 
        account.getPassword(), !!account.isPassenger, !!account.isDriver, 
        )
    }

    async saveAccount(account: any): Promise<any> {
        this.account.push(account);
    }
    
}