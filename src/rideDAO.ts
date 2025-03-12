import { connection } from "./accountDAO";

type Input = {
    ride_id: string;
    passenger_id: string;
    status: string;
    from_lat: number;
    from_long: number;
    to_lat: number;
    to_long: number;
    date: Date;
}
type Output = {
    ride_id: string;
    passenger_id: string;
    driver_id: string;
    status: string;
    fare: number;
    distance: number;
    from_lat: number;
    from_long: number;
    to_lat: number;
    to_long: number;
    date: Date;
}
export interface IRideDAO {
    saveRide(input: Input): Promise<void>;
    getRideById(rideId: string): Promise<Output>;
    getRideByPassengerId(passengerId: string): Promise<Output[]> 
}

export class RideDAODatabase implements IRideDAO {
   async getRideById(rideId: string): Promise<Output> {
        const [ride] = await connection.query(`
            select * from ccca.ride where ride_id = $1
        `, [rideId]);

        return ride;
   }

   async getRideByPassengerId(passengerId: string): Promise<Output[]> {
    const ride = await connection.query(`
        select * from ccca.ride where passenger_id = $1
    `, [passengerId]);

    return ride;
}

   async saveRide(input: Input): Promise<void> {
       await connection.query(`
        insert into ccca.ride(
            ride_id, 
            passenger_id, 
            status,
            from_lat, 
            from_long,
            to_lat, 
            to_long, 
            date
        ) values ($1,$2,$3,$4,$5,$6,$7,$8)
      `, [input.ride_id, input.passenger_id, input.status, input.from_lat,
        input.from_long, input.to_lat,input.to_long, input.date 
      ])
   } 
}

export class RideDAOMemory implements IRideDAO {
    ride: any[];

    constructor() {
        this.ride = []
    };

    async getRideById(rideId: string): Promise<Output> {
        const ride = this.ride.find((r => r.ride_id === rideId));
        return ride;
    };

    async saveRide(input: Input): Promise<void> {
        this.ride.push(input);
        return;
    }
    
    async getRideByPassengerId(passengerId: string): Promise<Output[]> {
        const rides = this.ride.filter((r => r.passenger_id === passengerId));

        return rides
    }
}