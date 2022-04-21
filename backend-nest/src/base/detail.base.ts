import { Prop } from '@nestjs/mongoose';
import {Types} from 'mongoose';

export class Detail {

    @Prop({
        type: Boolean, required: true, default: false
    })
    public isDeleted: boolean;

    @Prop({
        type: Types.ObjectId, required: false, ref: 'User',
    })
    createdById?: Types.ObjectId;

    @Prop({
        type: Types.ObjectId, required: false, ref: 'User',
    })
    updatedById?: Types.ObjectId;

    @Prop({
        type: String, required: false
    })
    createdBy?: string;

    @Prop({
        type: String, required: false
    })
    updatedBy?: string;

}