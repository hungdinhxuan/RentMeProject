import { Status } from "../enums/status.enum";

export class CreatePlayerDto {
    shortDesc: string;
    longDesc: string;
    userId: string;
    coverBackground: string;
    pricePerHour: number;
    recordVoiceUrl: string;
    albums: string[];
    timeCanReceive: number[];
    status: Status;
}
