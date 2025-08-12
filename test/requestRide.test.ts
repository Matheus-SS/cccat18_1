import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../src/accountRepository";
import { Registry } from "../src/DI";
import GetAccount from "../src/GetAccount";
import GetRide from "../src/GetRide";
import { RequestRide } from "../src/RequestRide";
import { RideDAODatabase, RideDAOMemory } from "../src/rideDAO";
import Signup from "../src/Signup";
import { errors } from "../src/utils";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
    const accountDAO = new AccountRepositoryMemory();
    const rideDAO = new RideDAOMemory();
    Registry.getInstance().provide('accountRepository', accountDAO);
    signup = new Signup();
    getAccount = new GetAccount();
    requestRide = new RequestRide(rideDAO, accountDAO);
    getRide = new GetRide(rideDAO);
});
test('Deve conseguir chamar uma corrida', async () => {
  const body = {
    name: "teste coverage",
    email: `teste${Math.random()}@gmail.com`,
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "418.311.080-70"
  };

  const response = await signup.execute(body);
  expect(response.accountId).toBeDefined();
  const getAccountData = await getAccount.execute(response.accountId);
  const rideBody = {
    passenger_id: getAccountData.accountId,
    from_lat: 123,
    from_long: 123,
    to_lat: 123,
    to_long: 123,
  };

  const response2 = await requestRide.execute({
    ...rideBody,
    passenger_id: rideBody.passenger_id!
  });
  expect(response2.rideId).toBeDefined();
  const getRideData = await getRide.execute(response2.rideId);
  expect(getRideData.ride_id).toBe(response2.rideId);
  expect(getRideData.status).toBe('requested');
  expect(getRideData.from_lat).toBe(rideBody.from_lat);
  expect(getRideData.from_long).toBe(rideBody.from_long);
  expect(getRideData.to_lat).toBe(rideBody.to_lat);
  expect(getRideData.to_long).toBe(rideBody.to_long);
});

test('Deve lancar um erro quando for requisitar uma corrida nao seja passageiro', async () => {
    const body = {
        name: "teste coverage",
        email: `teste${Math.random()}@gmail.com`,
        isDriver: true,
        isPassenger: false,
        carPlate: "ABC01234",
        password: "123456",
        cpf: "418.311.080-70"
      };

      const response = await signup.execute(body);
      expect(response.accountId).toBeDefined();
      const getAccountData = await getAccount.execute(response.accountId);
      if(!getAccountData.accountId) return;
      const rideBody = {
        passenger_id: getAccountData.accountId,
        from_lat: 123,
        from_long: 123,
        to_lat: 123,
        to_long: 123,
      };
      await expect(() => requestRide.execute(rideBody)).rejects.toThrow(new Error(errors.NOT_PASSENGER));
});

test('Lancar um erro se já não existe uma corrida do passageiro em status diferente de "completed"', async () => {
  const body = {
    name: "teste coverage",
    email: `teste${Math.random()}@gmail.com`,
    isDriver: false,
    isPassenger: true,
    password: "123456",
    cpf: "418.311.080-70"
  };

  const response = await signup.execute(body);
  expect(response.accountId).toBeDefined();
  const getAccountData = await getAccount.execute(response.accountId);
  if(!getAccountData.accountId) return;

  const rideBody = {
    passenger_id: getAccountData.accountId,
    from_lat: 123,
    from_long: 123,
    to_lat: 123,
    to_long: 123,
  };
  await requestRide.execute(rideBody);
  await expect(() => requestRide.execute(rideBody)).rejects.toThrow(new Error(errors.RIDE_NOT_COMPLETED));
})