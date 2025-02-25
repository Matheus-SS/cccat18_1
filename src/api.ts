import express from "express";
import { getAccount, signup } from "./signup";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    const input = req.body;
    try {
        const output = await signup(input);
        return res.status(200).json(output)    
    } catch (error: any) {
        return res.status(422).json(error.message)
    }
});

app.get("/accounts/:accountId", async function (req, res) {
    const output = await getAccount(req.params.accountId);
    res.json(output);
});

export default app;
