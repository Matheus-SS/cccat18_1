import express from "express";
import Signup from "./Signup";
import { AccountRepositoryDatabase, connection } from "./accountRepository";
import GetAccount from "./GetAccount";
import { RideDAODatabase } from "./rideDAO";
import { RequestRide } from "./RequestRide";
import GetRide from "./GetRide";
import { Registry } from "./DI";

const app = express();
app.use(express.json());
const accountRepository = new AccountRepositoryDatabase();
Registry.getInstance().provide('accountRepository', accountRepository);
app.post("/signup", async function (req, res) {
    const input = req.body;
    try {
        const signup = new Signup()
        const output = await signup.execute(input);
        return res.status(200).json(output)    
    } catch (error: any) {
        return res.status(422).json(error.message)
    }
});

app.get("/accounts/:accountId", async function (req, res) {
    const getAccount = new GetAccount();
    const output = await getAccount.execute(req.params.accountId);
    res.json(output);
});

app.post("/rides", async function (req, res) {
    try {
        const rideDAO = new RideDAODatabase();
        const accountRepository = new AccountRepositoryDatabase();
        const requestRide = new RequestRide(rideDAO, accountRepository);
        const output = await requestRide.execute({
            passenger_id: req.body.passengerId,
            from_lat: req.body.fromLat,
            from_long: req.body.fromLong,
            to_lat: req.body.toLat,
            to_long: req.body.toLong
        })
    res.json(output);
    } catch (error:any) {
        return res.status(422).json(error.message)
    }
});

app.get("/rides/:rideId", async function (req, res) {
    const rideDAO = new RideDAODatabase();
    const getRide = new GetRide(rideDAO);
    const output = await getRide.execute(req.params.rideId)
    res.json(output);
});

process.on('SIGINT', () => {
    connection.$pool.end()
});

process.on('SIGTERM', () => {
	connection.$pool.end()
});

export default app;
