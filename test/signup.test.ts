import request from "supertest";
import app from '../src/api';
import { connection, errors, getAccount, signup } from '../src/signup';

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
  const response = await signup(body);
  expect(response.accountId).toBeDefined()
  const getAccountData = await getAccount(response.accountId);
  expect(getAccountData.name).toBe(body.name);
  expect(getAccountData.email).toBe(body.email);
  expect(getAccountData.cpf).toBe(body.cpf);
  expect(getAccountData.is_driver).toBe(body.isDriver);
  expect(getAccountData.is_passenger).toBe(body.isPassenger);
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
  await signup(body);
  await expect(() => signup(body)).rejects.toThrow(new Error(errors.EMAIL_ALREADY_EXISTS))
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