import { validateCpf } from "./validateCpf";
import IAccountDAO from "./accountDAO";
import { Account } from "./Account";
import { errors } from "./utils";

export default class Signup {
	constructor (readonly accountDAO: IAccountDAO) {}
	async execute(input: any) {
		const account = Account.create(input.name, input.email, input.carPlate, input.cpf, input.password, input.isPassenger, input.isDriver)
		const acc = await this.accountDAO.getAccountByEmail(account.getEmail())
		if (acc) throw new Error(errors.EMAIL_ALREADY_EXISTS);
		await this.accountDAO.saveAccount(input)
		return {
			accountId: input.accountId
		};
	};
}