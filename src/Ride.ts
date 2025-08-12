import { Coord } from "./Coord";
import { UUID } from "./UUID";

export class Ride {
    private passenger_id: UUID;
    private ride_id: UUID;
    private from: Coord;
    private to:Coord;

    constructor(
        ride_id: string,
        passenger_id: string,
        from_lat: number,
        to_lat: number,
        from_long: number,
        to_long: number
    ) {
        this.ride_id = new UUID(ride_id);
        this.passenger_id = new UUID(passenger_id);
        this.from = new Coord(from_lat, from_long);
        this.to = new Coord(to_lat, to_long);
    }

    static create(
        passenger_id: string,
        from_lat: number,
        from_long: number,
        to_lat: number,
        to_long: number
    ): Ride {
        const uuid = UUID.create()
        return new Ride(
            uuid.getValue(),
            passenger_id,
            from_lat,
            from_long,
            to_lat,
            to_long
        );
    }

    getRideId(): UUID {
        return this.ride_id;
    }

    getPassengerId(): UUID {
        return this.passenger_id;
    }
}