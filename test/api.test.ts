import request from "supertest";
import app from '../src/api';
import { connection } from '../src/signup';

afterEach(() => {
   connection.query("TRUNCATE TABLE ccca.account");
});

test('deve conseguir se cadastrar como passageiro', async () => {
  const body = {
    name: "teste coverage",
    email: "teste@gmail.com",
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "418.311.080-70"
  }
  const response = await request(app).post("/signup").send(body);
  const getAccountData = await request(app).get(`/accounts/${response.body.accountId}`);
  expect(getAccountData.body.name).toBe(body.name);
  expect(getAccountData.body.email).toBe(body.email);
  expect(getAccountData.body.cpf).toBe(body.cpf);
  expect(getAccountData.body.is_driver).toBe(body.isDriver);
  expect(getAccountData.body.is_passenger).toBe(body.isPassenger);
  expect(response.statusCode).toBe(200);
});

test('deve lancar erro de que já existe usuário com esse email', async () => {
  const body = {
    name: "teste coverage",
    email: "teste1@gmail.com",
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "239.575.920-11"
  }
  await request(app).post("/signup").send(body);
  const response = await request(app).post("/signup").send(body);
  console.log("response", JSON.parse(response.text).message);
  expect(response.statusCode).toBe(422);
  expect(JSON.parse(response.text).message).toBe(-4);
});

test('deve lancar erro de usuario com NOME inválido', async () => {
  const body = {
    name: "teste",
    email: "teste1@gmail.com",
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "239.575.920-11"
  }
  const response = await request(app).post("/signup").send(body);
  expect(response.statusCode).toBe(422);
  expect(JSON.parse(response.text).message).toBe(-3);
});

test('deve lancar erro de usuario com CPF inválido', async () => {
  const body = {
    name: "teste COVERAGE",
    email: "teste1@gmail.com",
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "239.575.920-1"
  }
  const response = await request(app).post("/signup").send(body);
  expect(response.statusCode).toBe(422);
  expect(JSON.parse(response.text).message).toBe(-1);
});

test('deve lancar erro de usuario com EMAIL inválido', async () => {
  const body = {
    name: "teste COVERAGE",
    email: "teste1gmail.com",
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "239.575.920-11"
  }
  const response = await request(app).post("/signup").send(body);
  expect(JSON.parse(response.text).message).toBe(-2);
});

test('deve conseguir se cadastrar como motorista', async () => {
  const body = {
    name: "teste COVERAGE",
    email: "teste@gmail.com",
    isDriver: true,
    isPassenger: false,
    carPlate: "ABC01234",
    password: "123456",
    cpf: "239.575.920-11"
  }
  const response = await request(app).post("/signup").send(body);
  expect(response.body).toHaveProperty("accountId")
});

test('deve lancar erro ao inserir usuario como motorista com placa do carro inválida', async () => {
  const body = {
    name: "teste COVERAGE",
    email: "teste@gmail.com",
    isDriver: true,
    isPassenger: false,
    carPlate: "ABC",
    password: "123456",
    cpf: "239.575.920-11"
  }
  const response = await request(app).post("/signup").send(body);
  expect(JSON.parse(response.text).message).toBe(-5);
});