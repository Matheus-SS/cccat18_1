import crypto from "crypto";

import { validateCpf } from "./validateCpf";
import IAccountDAO from "./accountDAO";
import { errors, validateCarPlate, validateEmail, validateName } from "./utils";

export default class Signup {
	constructor (readonly accountDAO: IAccountDAO) {}
	async execute(input: any) {
		input.accountId = crypto.randomUUID();
		const acc = await this.accountDAO.getAccountByEmail(input.email)
		if (acc) throw new Error(errors.EMAIL_ALREADY_EXISTS);
		if (!validateName(input.name)) throw new Error(errors.INVALID_NAME);
		if (!validateEmail(input.email)) throw new Error(errors.INVALID_EMAIL);
		if (!validateCpf(input.cpf)) throw new Error(errors.INVALID_CPF);
		if (input.isDriver && !validateCarPlate(input.carPlate)) throw new Error(errors.INVALID_CAR_PLATE);
		await this.accountDAO.saveAccount(input)
		return {
			accountId: input.accountId
		};
	};
}