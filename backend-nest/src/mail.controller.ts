import { Controller, Post, Query } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiQuery } from "@nestjs/swagger";
import { SendgridService } from "./sendgrid.service";

@Controller('mail')

export class MailController {
    constructor(
        private readonly sendgridService: SendgridService,
        private readonly configService: ConfigService
        
    ){}
    
    @ApiQuery({ name: 'email', description: 'Email address to send email' })
    @Post('send')
    async sendEmail(@Query('email') email) {
        const mail = {
            to: email,
            subject: 'Greeting Message from NestJS Sendgrid',
            from: this.configService.get<string>('SEND_GRID_EMAIL_SENDER'),
            text: 'Hello World from NestJS Sendgrid',
            html: '<h1>Hello World from NestJS Sendgrid</h1>'
        };

        return await this.sendgridService.send(mail);
    }
}