export class Coord {
    private latitude: number;
    private longitude: number;

    constructor(latitude: number, longitude: number) {
        if (latitude < -90 || latitude > 90) {
            throw new Error("Invalida latitude");
        }
        if (longitude < -180 || longitude > 180) {
            throw new Error("Invalid longitude");
        }
        this.latitude = latitude;
        this.longitude = longitude;
    }

    getLatitude(): number {
        return this.latitude;
    }

    getLongitude(): number {
        return this.longitude;
    }
}