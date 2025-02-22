import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());


export const connection = pgp()({
	connectionString: "postgres://postgres:123456@localhost:5432/app",
	max: 10
});

async function getAccount(account_id: string) {
	await connection.query("select * from ccca.account where account_id = $1", [account_id]);
};

app.post("/signup", async function (req, res) {
	console.log("body",req.body);
	const input = req.body;
	try {
		const id = crypto.randomUUID();
		const [acc] = await connection.query("select * from ccca.account where email = $1", [input.email]);
		
		if (acc) {
			return res.status(422).json({ message: -4 });
		}
		
		if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) {
			return res.status(422).json({ message: -3 });
		}
		
		if (!input.email.match(/^(.+)@(.+)$/)) {
			return res.status(422).json({ message: -2 });
		}
		
		if (!validateCpf(input.cpf)) {
			return res.status(422).json({ message: -1 });
		}

		if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
			return res.status(422).json({ message: -5 });
		}

		let result;
		if (input.isDriver) {
			await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
				
			result = {
				accountId: id
			};
		} else {
			await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);

			result = {
				accountId: id
			};
		}
		
		return res.json(result);
	} catch(err) {
		console.log("Erro nao tratado", err);
	}
});

process.on('SIGTERM', () => {
	connection.$pool.end()
});

export default app;
