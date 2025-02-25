import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

export const errors = {
	EMAIL_ALREADY_EXISTS: 'User already exists',
	INVALID_NAME: 'Invalid name',
	INVALID_EMAIL: 'Invalid email',
	INVALID_CPF: 'Invalid cpf',
	INVALID_CAR_PLATE: 'Invalid car plate'
}

export const connection = pgp()({
	connectionString: "postgres://postgres:123456@localhost:5432/app",
	max: 10
});

function validateName(name: string): boolean {
	return !!name.match(/[a-zA-Z] [a-zA-Z]+/)?.length
};
function validateEmail(email: string): boolean {
	return !!email.match(/^(.+)@(.+)$/)?.length
};
function validateCarPlate(carPlate: string): boolean {
	return !!carPlate.match(/[A-Z]{3}[0-9]{4}/)?.length
};

export async function signup(input: any) {
	const id = crypto.randomUUID();
	const [acc] = await connection.query("select * from ccca.account where email = $1", [input.email]);
	if (acc) throw new Error(errors.EMAIL_ALREADY_EXISTS);
	if (!validateName(input.name)) throw new Error(errors.INVALID_NAME);
	if (!validateEmail(input.email)) throw new Error(errors.INVALID_EMAIL);
	if (!validateCpf(input.cpf)) throw new Error(errors.INVALID_CPF);
	if (input.isDriver && !validateCarPlate(input.carPlate)) throw new Error(errors.INVALID_CAR_PLATE);
	await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
	return {
		accountId: id
	};
};

export async function getAccount(accountId: string) {
	const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
	return accountData;
};

process.on('SIGTERM', () => {
	connection.$pool.end()
});
