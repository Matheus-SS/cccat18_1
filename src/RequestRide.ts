import IAccountRepository from "./accountRepository";
import { inject } from "./DI";
import { IRideDAO } from "./rideDAO";
import { errors } from "./utils";

type Input = {
    passenger_id: string;
    from_lat: number;
    from_long: number;
    to_lat: number;
    to_long: number;
}
export class RequestRide {
    @inject('rideDAO')
    private rideDAO?: IRideDAO;
    @inject('accountRepository')
    private accountRepository?: IAccountRepository;

    async execute(input: Input) {
        const account = await this.accountRepository?.getAccountById(input.passenger_id);

        if (!account?.isPassenger) {
            throw new Error(errors.NOT_PASSENGER)
        };

        const rides = await this.rideDAO.getRideByPassengerId(input.passenger_id);

        for (const ride of rides) {
          if (ride.status !== 'completed') {
            throw new Error(errors.RIDE_NOT_COMPLETED)
          }
        }
        const ride_id = crypto.randomUUID();
        await this.rideDAO.saveRide({
            ride_id: ride_id,
            date: new Date(),
            status: 'requested',
            from_lat: input.from_lat,
            from_long: input.from_long,
            to_lat: input.to_lat,
            to_long: input.to_long,
            passenger_id: input.passenger_id
        });

        return {
            rideId: ride_id
        }
    }
}