import { AccountRepositoryDatabase, AccountRepositoryMemory, connection } from "../src/accountRepository";
import GetAccount from "../src/GetAccount";
import Signup from "../src/Signup";
import { errors } from "../src/utils";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  const accountRepository = new AccountRepositoryDatabase();
  //const accountRepository = new AccountRepositoryMemory();
  signup = new Signup(accountRepository);
  getAccount = new GetAccount(accountRepository);

})

// afterEach(() => {
//    connection.query("TRUNCATE TABLE ccca.account");
// });

test('deve conseguir se cadastrar como passageiro', async () => {
  const body = {
    name: "teste coverage",
    email: `teste${Math.random()}@gmail.com`,
    isPassenger: true,
    password: "123456",
    cpf: "418.311.080-70"
  }
  const response = await signup.execute(body);
  expect(response.accountId).toBeDefined()
  const getAccountData = await getAccount.execute(response.accountId);
  expect(getAccountData.name).toBe(body.name);
  expect(getAccountData.email).toBe(body.email);
  expect(getAccountData.cpf).toBe(body.cpf);
  expect(getAccountData.isPassenger).toBe(body.isPassenger);
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
  await signup.execute(body);
  await expect(() => signup.execute(body)).rejects.toThrow(new Error(errors.EMAIL_ALREADY_EXISTS))
});

test('deve lancar erro de usuario com NOME inválido', async () => {
  const body = {
    name: "teste",
    email: `teste${Math.random()}@gmail.com`,
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "239.575.920-11"
  }
 
  await expect(() => signup.execute(body)).rejects.toThrow(new Error(errors.INVALID_NAME))
});

test('deve lancar erro de usuario com CPF inválido', async () => {
  const body = {
    name: "teste COVERAGE",
    email: `teste${Math.random()}@gmail.com`,
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "239.575.920-1"
  }
  await expect(() => signup.execute(body)).rejects.toThrow(new Error(errors.INVALID_CPF))
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
  await expect(() => signup.execute(body)).rejects.toThrow(new Error(errors.INVALID_EMAIL))
});

test('deve conseguir se cadastrar como motorista', async () => {
  const body = {
    name: "teste COVERAGE",
    email: `teste${Math.random()}@gmail.com`,
    isDriver: true,
    isPassenger: false,
    carPlate: "ABC01234",
    password: "123456",
    cpf: "239.575.920-11"
  }
  const response = await signup.execute(body);
  expect(response.accountId).toBeDefined()
  const getAccountData = await getAccount.execute(response.accountId);
  expect(getAccountData.name).toBe(body.name);
  expect(getAccountData.email).toBe(body.email);
  expect(getAccountData.cpf).toBe(body.cpf);
  expect(getAccountData.isDriver).toBe(body.isDriver);
  expect(getAccountData.isPassenger).toBe(body.isPassenger);
});

test('deve lancar erro ao inserir usuario como motorista com placa do carro inválida', async () => {
  const body = {
    name: "teste COVERAGE",
    email: `teste${Math.random()}@gmail.com`,
    isDriver: true,
    isPassenger: false,
    carPlate: "ABC",
    password: "123456",
    cpf: "239.575.920-11"
  }
  await expect(() => signup.execute(body)).rejects.toThrow(new Error(errors.INVALID_CAR_PLATE))
});