import request from "supertest";
import app from '../src/api';
import { errors } from "../src/utils";

test('deve conseguir se cadastrar como passageiro', async () => {
  const body = {
    name: "teste coverage",
    email: `teste${Math.random()}@gmail.com`,
    isPassenger: true,
    password: "123456",
    cpf: "418.311.080-70"
  }
  const response = await request(app).post("/signup").send(body);
  const getAccountData = await request(app).get(`/accounts/${response.body.accountId}`);
  expect(getAccountData.body.name).toBe(body.name);
  expect(getAccountData.body.email).toBe(body.email);
  expect(getAccountData.body.cpf).toBe(body.cpf);
  expect(getAccountData.body.isPassenger).toBe(body.isPassenger);
  expect(response.statusCode).toBe(200);
});

test('deve lancar erro de que já existe usuário com esse email', async () => {
  const body = {
    name: "teste coverage",
    email: `teste${Math.random()}@gmail.com`,
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "239.575.920-11"
  }
  await request(app).post("/signup").send(body);
  const response = await request(app).post("/signup").send(body);
  expect(response.statusCode).toBe(422);
  expect(response.body).toBe(errors.EMAIL_ALREADY_EXISTS);
});

test('deve conseguir se cadastrar uma corrida como passageiro', async () => {
  const body = {
    name: "teste coverage",
    email: `teste${Math.random()}@gmail.com`,
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "418.311.080-70"
  }
  const response = await request(app).post("/signup").send(body);
  const getAccountData = await request(app).get(`/accounts/${response.body.accountId}`);
  const rideBody = {
    passengerId: getAccountData.body.accountId,
    fromLat: "123",
    fromLong: "123",
    toLat: "123",
    toLong: "123",
  };
  const response2 = await request(app).post("/rides").send(rideBody);
  const getRideData = await request(app).get(`/rides/${response2.body.rideId}`);
  
  expect(getRideData.body.ride_id).toBe(response2.body.rideId);
  expect(getRideData.body.status).toBe('requested');
  expect(getRideData.body.passenger_id).toBe(rideBody.passengerId);
  expect(getRideData.body.from_lat).toBe(rideBody.fromLat);
  expect(getRideData.body.from_long).toBe(rideBody.fromLong);
  expect(getRideData.body.to_lat).toBe(rideBody.toLat);
  expect(getRideData.body.to_long).toBe(rideBody.toLong);
  expect(response.statusCode).toBe(200);
});

test('deve lancar erro de que não é um passageiro ao pedir uma corrida', async () => {
  const body = {
    name: "teste coverage",
    email: `teste${Math.random()}@gmail.com`,
    isDriver: true,
    isPassenger: false,
    carPlate: "ABC1234",
    password: "123456",
    cpf: "418.311.080-70"
  }
  const response = await request(app).post("/signup").send(body);

  const getAccountData = await request(app).get(`/accounts/${response.body.accountId}`);
  const rideBody = {
    passengerId: getAccountData.body.account_id,
    fromLat: 123,
    fromLong: 123,
    toLat: 123,
    toLong: 123,
  };

  const response2 = await request(app).post("/rides").send(rideBody);
  expect(response2.statusCode).toBe(422);
  expect(response2.body).toBe(errors.NOT_PASSENGER);
});