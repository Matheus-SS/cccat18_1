import IAccountRepository from "./accountRepository";
import { Account } from "./Account";
import { errors } from "./utils";
import { inject, Registry } from "./DI";

export default class Signup {
	@inject('accountRepository')
	accountRepository?: IAccountRepository;
	constructor () {}
	async execute(input: any) {
		const account = Account.create(input.name, input.email, input.carPlate, input.cpf, input.password, input.isPassenger, input.isDriver)
		const acc = await this.accountRepository?.getAccountByEmail(account.getEmail())
		if (acc) throw new Error(errors.EMAIL_ALREADY_EXISTS);
		await this.accountRepository?.saveAccount(account)
		return {
			accountId: account.getAccountId()
		};
	};
}