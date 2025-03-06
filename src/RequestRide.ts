import { IRideDAO } from "./rideDAO";

type Input = {
    passenger_id: string;
    from_lat: number;
    from_long: number;
    to_lat: number;
    to_long: number;
}
export class RequestRide {
    constructor(readonly rideDAO: IRideDAO) {}

    async execute(input: Input) {
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
    }
}