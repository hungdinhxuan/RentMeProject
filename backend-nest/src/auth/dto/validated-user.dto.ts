import { Types } from 'mongoose';
export class validatedUser {
    userId: Types.ObjectId;
    username: string;
    role: number;
    roleString: string;
}