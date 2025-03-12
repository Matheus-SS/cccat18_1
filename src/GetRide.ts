import { IRideDAO } from "./rideDAO";

export default class GetRide {
    constructor (readonly rideDAO: IRideDAO) {}
    async execute(rideId: string) {
        const rideData = await this.rideDAO.getRideById(rideId);
        return rideData;
    };
}
