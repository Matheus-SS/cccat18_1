import express from "express";
import Signup from "./Signup";
import { AccountDAODatabase, connection } from "./accountDAO";
import GetAccount from "./GetAccount";
import { RideDAODatabase } from "./rideDAO";
import { RequestRide } from "./RequestRide";
import GetRide from "./GetRide";

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

app.post("/rides", async function (req, res) {
    try {
        const rideDAO = new RideDAODatabase();
        const accountDAO = new AccountDAODatabase();
        const requestRide = new RequestRide(rideDAO, accountDAO);
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
