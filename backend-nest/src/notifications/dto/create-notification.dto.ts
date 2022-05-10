import { CreateBase } from '../../base/dto/create.base.dto';
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateNotificationDto extends CreateBase {
    @IsString()
    @IsNotEmpty()
    @MaxLength(3000)
    @ApiProperty()
    public content: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public userId: string;
}
