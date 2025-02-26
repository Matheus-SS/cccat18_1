import express from "express";
import Signup from "./Signup";
import { AccountDAODatabase, connection } from "./accountDAO";
import GetAccount from "./GetAccount";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    const input = req.body;
    try {
        const accountDAO = new AccountDAODatabase();
        const signup = new Signup(accountDAO)
        const output = await signup.execute(input);
        return res.status(200).json(output)    
    } catch (error: any) {
        return res.status(422).json(error.message)
    }
});

app.get("/accounts/:accountId", async function (req, res) {
    const accountDAO = new AccountDAODatabase();
    const getAccount = new GetAccount(accountDAO);
    const output = await getAccount.execute(req.params.accountId);
    res.json(output);
});

process.on('SIGINT', () => {
    connection.$pool.end()
});

process.on('SIGTERM', () => {
	connection.$pool.end()
});

export default app;
