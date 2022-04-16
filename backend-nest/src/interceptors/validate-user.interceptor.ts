import { validatedUser } from './../auth/dto/validated-user.dto';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { Status } from 'src/users/enums/status.enum';


@Injectable()
export class ValidateUserInterceptor implements NestInterceptor {
   constructor(private usersService: UsersService) {}
   
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const requestUser: validatedUser = request.user;
    const user:any = await this.usersService.findOneById(requestUser.userId);
    
    if(user && user.status === Status.BANNED) {
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'This account has been banned. Please contact the administrator.',
          }, HttpStatus.FORBIDDEN);
    }

    if(user && user.deleted ) {
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'This account has been deleted. Please contact the administrator to restore this account.',
          }, HttpStatus.FORBIDDEN);
    }

    return next
      .handle()
      .pipe();
  }
}