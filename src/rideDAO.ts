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
export interface IRideDAO {
    saveRide(input: Input): Promise<void>
}

export class RideDAODatabase implements IRideDAO {
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