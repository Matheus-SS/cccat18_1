import pgp from "pg-promise";

export const connection = pgp()({
    connectionString: "postgres://postgres:123456@localhost:5432/app",
    max: 10
});
//PORT
export default interface IAccountDAO {
    getAccountByEmail(email: string): Promise<any>;
    getAccountById(accountId: string): Promise<any>;
    saveAccount(account: any): Promise<any>;
}
//ADAPTER
export class AccountDAODatabase implements IAccountDAO {
   async getAccountByEmail(email: string) {
        const [acc] = await connection.query("select * from ccca.account where email = $1", [email]);
        return acc
    };
    
    async getAccountById(accountId: string) {
        const [acc] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
        return acc
    };
    
    async saveAccount(account: any) {
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
                account.accountId, account.name, account.email, account.cpf, 
                account.carPlate, !!account.isPassenger, !!account.isDriver, 
                account.password
        ]);
    }
}
//ADAPTER
export class AccountDAOMemory implements IAccountDAO {
    account: any[]

    constructor () {
        this.account = []
    }

    async getAccountByEmail(email: string): Promise<any> {
        const a =  this.account.find(a => a.email === email);
        if (!a) return;
        const map =  {
            ...a,
            is_driver: a.isDriver,
            is_passenger: a.isPassenger
        }
        delete map.isDriver;
        delete map.isPassenger;
        return map;
    }

    async getAccountById(accountId: string): Promise<any> {
        const a =  this.account.find(a => a.accountId === accountId);
        if(!a) return;
        const map =  {
            ...a,
            is_driver: a.isDriver,
            is_passenger: a.isPassenger
        }
        delete map.isDriver;
        delete map.isPassenger;
        return map;
    }

    async saveAccount(account: any): Promise<any> {
        this.account.push(account);
    }
    
}